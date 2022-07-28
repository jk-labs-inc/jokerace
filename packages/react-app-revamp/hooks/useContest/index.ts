import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { chain, useProvider } from "wagmi";
import { fetchBlockNumber, fetchEnsName, fetchToken, getAccount, readContract, readContracts } from "@wagmi/core";
import { chains } from "@config/wagmi";
import isUrlToImage from "@helpers/isUrlToImage";
import { useStore } from "./store";
import { isBefore, isFuture } from "date-fns";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import getContestContractVersion from "@helpers/getContestContractVersion";

export function useContest() {
  const provider = useProvider();
  const { asPath } = useRouter();
  const [chainId, setChaindId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(' ', '') === asPath.split("/")[2])?.[0]?.id,
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
    //@ts-ignore
    setContestPrompt,
    //@ts-ignore
    currentUserProposalCount,
  } = useStore();

  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = "This contract doesn't exist on this chain.";
    toast.error(toastMessage);
  }

  async function fetchContestInfo() {
    setIsLoading(true);
    setIsListProposalsLoading(true);
    const abi = await getContestContractVersion(address);
    if (abi === null) {
      toast.error("This contract doesn't exist on this chain.");
      setIsError("This contract doesn't exist on this chain.");
      setIsSuccess(false);
      setCheckIfUserPassedSnapshotLoading(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
      return;
    }
    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
    };
    try {
      const contracts = [
        // Contest name
        {
          ...contractConfig,
          functionName: "name",
        },
        // Contest creator address
        {
          ...contractConfig,
          functionName: "creator",
        },
        // Maximum submissions *per user* for the contest
        {
          ...contractConfig,
          functionName: "numAllowedProposalSubmissions",
        },
        // Maximum amout of proposals for the contest
        {
          ...contractConfig,
          functionName: "maxProposalCount",
        },
        // Voting token address
        {
          ...contractConfig,
          functionName: "token",
        },
        // Timestamp when contest start (submissions open)
        {
          ...contractConfig,
          functionName: "contestStart",
        },
        // Timestamp when contest ends (voting closes)
        {
          ...contractConfig,
          functionName: "contestDeadline",
        },
        // Timestamp when votes open
        {
          ...contractConfig,
          functionName: "voteStart",
        },
        // Contest status
        {
          ...contractConfig,
          functionName: "state",
        },
        // Amount of token required for a user to vote
        {
          ...contractConfig,
          functionName: "proposalThreshold",
        },
      ];
      if (abi?.filter(el => el.name === "prompt").length > 0) {
        contracts.push({
          ...contractConfig,
          functionName: "prompt",
        });
      }

      const results = await readContracts({ contracts });
      if (abi?.filter(el => el.name === "prompt").length > 0) setContestPrompt(results[contracts.length - 1]);
      setContestName(results[0]);
      const contestAuthorEns = await fetchEnsName({
        //@ts-ignore
        address: results[1],
        chainId: chain.mainnet.id,
      });
      setContestAuthor(contestAuthorEns && contestAuthorEns !== null ? contestAuthorEns : results[1]);
      setContestMaxNumberSubmissionsPerUser(results[2]);
      setContestMaxProposalCount(results[3]);
      setVotingTokenAddress(results[4]);
      // Voting token data (balance, symbol, total supply etc) (for ERC-20 token)
      //@ts-ignore
      const tokenRawData = await fetchToken({ address: results[4], chainId });
      setVotingToken(tokenRawData);
      //@ts-ignore
      setSubmissionsOpen(new Date(parseInt(results[5]) * 1000));
      //@ts-ignore
      setVotesClose(new Date(parseInt(results[6]) * 1000));
      //@ts-ignore
      setVotesOpen(new Date(parseInt(results[7]) * 1000));
      if (
        //@ts-ignore
        results[8] === CONTEST_STATUS.SUBMISSIONS_OPEN &&
        //@ts-ignore
        isBefore(new Date(), new Date(parseInt(results[5]) * 1000))
      ) {
        // If the contest status is marked as open
        // but the current date is before the opening of submissions
        // Then we use a special status on the frontend
        // This way we can display a countdown until submissions open
        setContestStatus(CONTEST_STATUS.SUBMISSIONS_NOT_OPEN);
      } else {
        setContestStatus(results[8]);
      }
      //@ts-ignore
      setAmountOfTokensRequiredToSubmitEntry(results[9] / 1e18);

      // Current user votes
      await updateCurrentUserVotes();
      // Check snapshot
      await checkIfCurrentUserQualifyToVote();
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
    const abi = await getContestContractVersion(address);
    if (abi === null) {
      toast.error("This contract doesn't exist on this chain.");
      setIsError("This contract doesn't exist on this chain.");
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setCheckIfUserPassedSnapshotLoading(false);
      setIsLoading(false);
      return;
    }

    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
    };
    const contractBaseOptions = {};
    setCheckIfUserPassedSnapshotLoading(true);

    try {
      const accountData  = await getAccount()

      // Timestamp from when a user can vote
      // depending on the amount of voting token they're holding at a given timestamp (snapshot)
      const timestampSnapshotRawData = await readContract({
        ...contractConfig,
        ...contractBaseOptions,
        functionName: "contestSnapshot",
      });

      //@ts-ignore
      setUsersQualifyToVoteIfTheyHoldTokenAtTime(new Date(parseInt(timestampSnapshotRawData) * 1000));
      //@ts-ignore
      if (!isFuture(new Date(parseInt(timestampSnapshotRawData) * 1000))) {
        setSnapshotTaken(true);
        const delayedCurrentTimestamp = Date.now() - 59; // Delay by 59 seconds to make sure we're looking at a block that has been mined

        const timestampToCheck =
          //@ts-ignore
          delayedCurrentTimestamp >= timestampSnapshotRawData ? timestampSnapshotRawData : delayedCurrentTimestamp;

        const tokenUserWasHoldingAtSnapshotRawData = await readContract({
          ...contractConfig,
          ...contractBaseOptions,
          functionName: "getVotes",
          //@ts-ignore
          args: [accountData?.address, timestampToCheck],
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

  async function fetchProposal(i: number, contracts: any = [], proposalsIdsRawData: any) {
    const accountData  = await getAccount();
    const results = await readContracts({ contracts });
    // Create an array of proposals
    // A proposal is a pair of data
    // A pair of a proposal data is [content, votes]
    const proposalDataPerId = results.reduce((result, value, index, array) => {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, []);

    const data = proposalDataPerId[0][0];
    // proposal author ENS
    const author = await fetchEnsName({
      address: data[0],
      chainId: chain.mainnet.id,
    });

    const proposalData = {
      authorEthereumAddress: data[0],
      author: author ?? data[0],
      content: data[1],
      isContentImage: isUrlToImage(data[1]) ? true : false,
      exists: data[2],
      //@ts-ignore
      votes: proposalDataPerId[0][1] / 1e18,
    };
    // Check if that proposal belongs to the current user
    // (Needed to track if the current user can submit a proposal)
    //@ts-ignore
    if (data[0] === accountData?.address) {
      let tempCount = currentUserProposalCount;
      setCurrentUserProposalCount(tempCount++);
    }
    setProposalData({ id: proposalsIdsRawData[i], data: proposalData });
  }

  async function fetchAllProposals() {
    const abi = await getContestContractVersion(address);
    if (abi === null) {
      toast.error("This contract doesn't exist on this chain.");
      setIsError("This contract doesn't exist on this chain.");
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setCheckIfUserPassedSnapshotLoading(false);
      setIsLoading(false);
      return;
    }

    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
    };
    const contractBaseOptions = {};
    try {
      // Get list of proposals (ids)
      const proposalsIdsRawData = await readContract({
        ...contractConfig,
        ...contractBaseOptions,
        functionName: "getAllProposalIds",
      });
      setListProposalsIds(proposalsIdsRawData);
      if (proposalsIdsRawData.length > 0) {
        for (let i = 0; i < proposalsIdsRawData.length; i++) {
          // For all proposals, fetch
          const contracts: any = [];
          contracts.push(
            // proposal content
            {
              ...contractConfig,
              functionName: "getProposal",
              args: proposalsIdsRawData[i],
            },
            // Votes received
            {
              ...contractConfig,
              functionName: "proposalVotes",
              args: proposalsIdsRawData[i],
            },
          );
          fetchProposal(i, contracts, proposalsIdsRawData);
        }
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
    const abi = await getContestContractVersion(address);
    if (abi === null) {
      toast.error("This contract doesn't exist on this chain.");
      setIsError("This contract doesn't exist on this chain.");
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setCheckIfUserPassedSnapshotLoading(false);
      setIsLoading(false);
      return;
    }

    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
    };

    try {
      // get current block number
      const currentBlockNumber = await fetchBlockNumber();
      const timestamp = (await provider.getBlock(currentBlockNumber)).timestamp - 50; // (necessary to avoid block not mined error)
      const accountData  = await getAccount()
      const contracts = [
        // get current user availables votes now
        {
          ...contractConfig,
          functionName: "getVotes",
          //@ts-ignore
          args: [accountData?.address, timestamp],
        },
        // get votes cast by current user
        {
          ...contractConfig,
          functionName: "contestAddressTotalVotesCast",
          //@ts-ignore
          args: accountData?.address,
        },
      ];

      const results = await readContracts({ contracts });
      const currentUserAvailableVotesAmount = results[0];
      const currentUserTotalVotesCast = results[1];
      //@ts-ignore
      setCurrentUserTotalVotesCast(currentUserTotalVotesCast / 1e18);
      //@ts-ignore
      setCurrentUserAvailableVotesAmount(
        //@ts-ignore
        currentUserAvailableVotesAmount / 1e18 - currentUserTotalVotesCast / 1e18,
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
