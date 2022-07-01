import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { chain, useAccount, useProvider } from "wagmi";
import { fetchBlockNumber, fetchEnsName, fetchToken, readContract } from "@wagmi/core";
import { chains } from "@config/wagmi";
import isUrlToImage from "@helpers/isUrlToImage";
import { useStore } from "./store";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { isBefore, isFuture } from "date-fns";
import { CONTEST_STATUS } from "@helpers/contestStatus";

export function useContest() {
  const provider = useProvider();
  const { asPath } = useRouter();
  const account = useAccount();
  const [chainId, setChaindId] = useState(
    chains.filter(chain => chain.name.toLowerCase() === asPath.split("/")[2])?.[0]?.id,
  );
  const [address, setAddress] = useState(asPath.split("/")[3]);
  const {
    //@ts-ignore
    setContestName,
    //@ts-ignore
    setProposalData,
    //@ts-ignore
    setContestAuthor,
    //@ts-ignore
    setAmountOfTokensRequiredToSubmitEntry,
    //@ts-ignore
    setSubmissionsOpen,
    //@ts-ignore
    setContestStatus,
    //@ts-ignore
    setVotingTokenAddress,
    //@ts-ignore
    setVotingToken,
    //@ts-ignore
    setVotesOpen,
    //@ts-ignore
    setCurrentUserAvailableVotesAmount,
    //@ts-ignore
    setListProposalsIds,
    //@ts-ignore
    setIsError,
    //@ts-ignore
    setIsLoading,
    //@ts-ignore
    setIsListProposalsError,
    //@ts-ignore
    setIsListProposalsLoading,
    //@ts-ignore
    setVotesClose,
    //@ts-ignore
    isLoading,
    //@ts-ignore
    isListProposalsLoading,
    //@ts-ignore
    isError,
    //@ts-ignore
    isListProposalsError,
    //@ts-ignore
    isSuccess,
    //@ts-ignore
    setIsSuccess,
    //@ts-ignore
    isListProposalsSuccess,
    //@ts-ignore
    setIsListProposalsSuccess,
    //@ts-ignore
    resetListProposals,
    //@ts-ignore
    setCurrentUserTotalVotesCast,
    //@ts-ignore
    setContestMaxNumberSubmissionsPerUser,
    //@ts-ignore
    setContestMaxProposalCount,
    //@ts-ignore
    setCurrentUserProposalCount,
    //@ts-ignore
    setUsersQualifyToVoteIfTheyHoldTokenAtTime,
    //@ts-ignore
    setDidUserPassSnapshotAndCanVote,
    //@ts-ignore
    setSnapshotTaken,
    //@ts-ignore
    setCheckIfUserPassedSnapshotLoading,
  } = useStore();

  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = "This contract doesn't exist on this chain.";
    toast.error(toastMessage);
  }

  async function fetchContestInfo() {
    setIsLoading(true);
    setIsListProposalsLoading(true);
    try {
      const contractConfig = {
        addressOrName: address,
        contractInterface: DeployedContestContract.abi,
      };
      const contractBaseOptions = {};

      // Contest name
      const contestNameRawData = await readContract(contractConfig, "name", contractBaseOptions);
      setContestName(contestNameRawData);

      // Contest author ethereum address + ENS
      const contestAuthorRawData = await readContract(contractConfig, "creator", contractBaseOptions);
      const contestAuthorEns = await fetchEnsName({
        //@ts-ignore
        address: contestAuthorRawData,
        chainId: chain.mainnet.id,
      });
      setContestAuthor(contestAuthorEns && contestAuthorEns !== null ? contestAuthorEns : contestNameRawData);

      // Maximum submissions *per user* for the contest
      const contestMaxNumberSubmissionsPerUser = await readContract(
        contractConfig,
        "numAllowedProposalSubmissions",
        contractBaseOptions,
      );
      setContestMaxNumberSubmissionsPerUser(contestMaxNumberSubmissionsPerUser.toNumber());

      // Maximum amout of proposals for the contest
      const contestMaxProposalCount = await readContract(contractConfig, "maxProposalCount", contractBaseOptions);
      setContestMaxProposalCount(contestMaxProposalCount.toNumber());

      // Voting token
      // Address
      const tokenAddressRawData = await readContract(contractConfig, "token", contractBaseOptions);
      setVotingTokenAddress(tokenAddressRawData);
      // Data (balance, symbol, total supply etc) (for ERC-20 token)
      //@ts-ignore
      const tokenRawData = await fetchToken({ address: tokenAddressRawData, chainId });
      setVotingToken(tokenRawData);

      // Current user votes
      await updateCurrentUserVotes();

      // Timestamp when contest start (submissions open)
      const contestStartRawData = await readContract(contractConfig, "contestStart", contractBaseOptions);
      //@ts-ignore
      setSubmissionsOpen(new Date(parseInt(contestStartRawData) * 1000));

      // Timestamp when contest ends (voting closes)
      const deadlineRawData = await readContract(contractConfig, "contestDeadline", contractBaseOptions);
      //@ts-ignore
      setVotesClose(new Date(parseInt(deadlineRawData) * 1000));

      // Timestamp when votes open
      const votesOpenRawData = await readContract(contractConfig, "voteStart", contractBaseOptions);
      //@ts-ignore
      setVotesOpen(new Date(parseInt(votesOpenRawData) * 1000));

      // Contest status
      const statusRawData = await readContract(contractConfig, "state", contractBaseOptions);
      if (
        //@ts-ignore
        statusRawData === CONTEST_STATUS.SUBMISSIONS_OPEN &&
        //@ts-ignore
        isBefore(new Date(), new Date(parseInt(contestStartRawData) * 1000))
      ) {
        setContestStatus(CONTEST_STATUS.SUBMISSIONS_NOT_OPEN);
      } else {
        setContestStatus(statusRawData);
      }

      await checkIfCurrentUserQualifyToVote();

      // Amount of token required for a user to vote
      const amountOfTokensRequiredToSubmitEntryRawData = await readContract(
        contractConfig,
        "proposalThreshold",
        contractBaseOptions,
      );
      //@ts-ignore
      setAmountOfTokensRequiredToSubmitEntry(amountOfTokensRequiredToSubmitEntryRawData / 1e18);

      // List of proposals for this contest
      await fetchAllProposals();
    } catch (e) {
      onContractError(e);
      //@ts-ignore
      setIsError(e?.code ?? e);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
      console.error(e);
    }
  }

  async function checkIfCurrentUserQualifyToVote() {
    const contractConfig = {
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    };
    const contractBaseOptions = {};
    setCheckIfUserPassedSnapshotLoading(true);

    try {
      // Timestamp from when a user can vote
      // depending on the amount of voting token they're holding at a given timestamp (snapshot)
      const timestampSnapshotRawData = await readContract(contractConfig, "contestSnapshot", contractBaseOptions);

      //@ts-ignore
      setUsersQualifyToVoteIfTheyHoldTokenAtTime(new Date(parseInt(timestampSnapshotRawData) * 1000));
      //@ts-ignore
      if (!isFuture(new Date(parseInt(timestampSnapshotRawData) * 1000))) {
        setSnapshotTaken(true);
        const delayedCurrentTimestamp = Date.now() - 59; // Delay by 59 seconds to make sure we're looking at a block that has been mined

        const timestampToCheck =
          //@ts-ignore
          delayedCurrentTimestamp >= timestampSnapshotRawData ? timestampSnapshotRawData : delayedCurrentTimestamp;

        const tokenUserWasHoldingAtSnapshotRawData = await readContract(contractConfig, "getVotes", {
          ...contractBaseOptions,
          args: [account?.data?.address, timestampToCheck],
        });

        //@ts-ignore
        setDidUserPassSnapshotAndCanVote(tokenUserWasHoldingAtSnapshotRawData / 1e18 > 0);
      } else {
        setSnapshotTaken(false);
      }

      setCheckIfUserPassedSnapshotLoading(false);
    } catch (e) {
      console.error(e);
      setCheckIfUserPassedSnapshotLoading(false);
    }
  }

  async function fetchAllProposals() {
    const contractConfig = {
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    };
    const contractBaseOptions = {};
    setIsListProposalsLoading(true);
    try {
      // Get list of proposals (ids)
      const proposalsIdsRawData = await readContract(contractConfig, "getAllProposalIds", contractBaseOptions);
      setListProposalsIds(proposalsIdsRawData);
      if (proposalsIdsRawData.length > 0) {
        let currentUserProposalCount = 0;
        // For all proposals, fetch
        await Promise.all(
          proposalsIdsRawData.map(async (id: number) => {
            // proposal content
            const proposalRawData = await readContract(contractConfig, "getProposal", {
              args: id,
            });
            // votes received
            const proposalVotesData = await readContract(contractConfig, "proposalVotes", {
              args: id,
            });
            // author
            const author = await fetchEnsName({
              address: proposalRawData[0],
              chainId: chain.mainnet.id,
            });
            const proposalData = {
              authorEthereumAddress: proposalRawData[0],
              author: author ?? proposalRawData[0],
              content: proposalRawData[1],
              isContentImage: isUrlToImage(proposalRawData[1]) ? true : false,
              exists: proposalRawData[2],
              //@ts-ignore
              votes: proposalVotesData / 1e18,
            };
            // Check if that proposal belongs to the current user
            // Needed to track if the current user can submit a proposal
            if (proposalRawData[0] === account.data?.address) currentUserProposalCount++;
            setProposalData({ id, data: proposalData });
          }),
        );
        setCurrentUserProposalCount(currentUserProposalCount);
      }

      setIsLoading(false);
      setIsListProposalsLoading(false);
      setIsListProposalsError(null);
      setIsError(null);
      setIsListProposalsSuccess(true);
      setIsSuccess(true);
    } catch (e) {
      onContractError(e);
      console.error(e);
      setIsLoading(false);
      setIsSuccess(false);
      //@ts-ignore
      setIsListProposalsError(e?.code ?? e);
      setIsListProposalsLoading(false);
      setIsListProposalsSuccess(false);
    }
  }

  async function updateCurrentUserVotes() {
    const contractConfig = {
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    };
    const contractBaseOptions = {};

    try {
      // get current block number
      const currentBlockNumber = await fetchBlockNumber();
      const timestamp = (await provider.getBlock(currentBlockNumber)).timestamp - 50; // (necessary to avoid block not mined error)

      // get current user availables votes now
      //@ts-ignore
      const currentUserAvailableVotesAmountRawData = await readContract(contractConfig, "getVotes", {
        ...contractBaseOptions,
        args: [account?.data?.address, timestamp],
      });

      // get votes cast by current user
      const currentAddressTotalVotesCastRawData = await readContract(contractConfig, "contestAddressTotalVotesCast", {
        ...contractBaseOptions,
        args: account?.data?.address,
      });
      //@ts-ignore
      setCurrentUserTotalVotesCast(currentAddressTotalVotesCastRawData / 1e18);
      //@ts-ignore
      setCurrentUserAvailableVotesAmount(
        //@ts-ignore
        currentUserAvailableVotesAmountRawData / 1e18 - currentAddressTotalVotesCastRawData / 1e18,
      );
    } catch (e) {
      console.error(e);
    }
  }

  return {
    address,
    fetchContestInfo,
    setIsLoading,
    setIsListProposalsLoading,
    chainId,
    setChaindId,
    fetchAllProposals,
    isLoading,
    isListProposalsLoading,
    isError,
    isListProposalsError,
    isSuccess,
    isListProposalsSuccess,
    updateCurrentUserVotes,
    checkIfCurrentUserQualifyToVote,
    retry: fetchContestInfo,
    onSearch: (addr: string) => {
      setIsLoading(true);
      setIsListProposalsLoading(true);
      setListProposalsIds([]);
      resetListProposals();
      setAddress(addr);
    },
  };
}

export default useContest;
