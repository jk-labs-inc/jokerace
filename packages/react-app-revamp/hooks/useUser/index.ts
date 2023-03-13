import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { fetchBlockNumber, getAccount, readContract, readContracts } from "@wagmi/core";
import { isFuture } from "date-fns";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useNetwork, useProvider } from "wagmi";
import { useUserStore } from "./store";

export function useUser() {
  const provider = useProvider();
  const {
    setCurrentUserSubmitProposalTokensAmount,
    setDidUserPassSnapshotAndCanVote,
    setCheckIfUserPassedSnapshotLoading,
    setCurrentUserTotalVotesCast,
    setCurrentUserAvailableVotesAmount,
    setUsersQualifyToVoteIfTheyHoldTokenAtTime,
  } = useUserStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading } = useProposalStore(state => state);
  const { setIsSuccess, setIsLoading, setSnapshotTaken, setError } = useContestStore(state => state);
  const { chain, chains } = useNetwork();
  const { asPath } = useRouter();
  const [chainName, address] = asPath.split("/").slice(2, 4);

  /**
   * Display an error toast in the UI for any contract related error
   */
  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
    toast.error(toastMessage);
  }

  // Generate config for the contract
  async function getContractConfig() {
    const abi = await getContestContractVersion(address, chainName);
    if (abi === null) {
      toast.error(`This contract doesn't exist on ${chain?.name ?? "this chain"}.`);
      setError({ message: `This contract doesn't exist on ${chain?.name ?? "this chain"}.` });
      setIsSuccess(false);
      setCheckIfUserPassedSnapshotLoading(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
      return;
    }

    if (!chains) return;

    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
      chainId: chains.find(c => c.name.toLowerCase() === chainName)?.id,
    };

    return contractConfig;
  }

  /**
   * Check how many proposal tokens of this contest the current user holds
   */
  async function checkCurrentUserAmountOfProposalTokens() {
    const contractConfig = await getContractConfig();
    if (!contractConfig) return;
    const accountData = getAccount();
    const contractBaseOptions = {};

    try {
      const amount = await readContract({
        ...contractConfig,
        ...contractBaseOptions,
        functionName: "getCurrentSubmissionTokenVotes",
        args: [accountData?.address],
      });
      //@ts-ignore
      setCurrentUserSubmitProposalTokensAmount(amount / 1e18);
    } catch (e) {
      onContractError(e);
      //@ts-ignore
      const customError = e as CustomError;
      if (!customError) return;
      setError(customError);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
      console.error(e);
    }
  }

  /**
   * Check if the current user qualify to vote for this contest
   */
  async function checkIfCurrentUserQualifyToVote() {
    const contractConfig = await getContractConfig();
    if (!contractConfig) return;
    setCheckIfUserPassedSnapshotLoading(true);
    const accountData = getAccount();

    try {
      // Timestamp from when a user can vote
      // depending on the amount of voting token they're holding at a given timestamp (snapshot)
      const timestampSnapshotRawData = await readContract({
        ...contractConfig,
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
        if (accountData?.address) {
          const tokenUserWasHoldingAtSnapshotRawData = await readContract({
            ...contractConfig,
            functionName: "getVotes",
            //@ts-ignore
            args: [accountData?.address, timestampToCheck],
          });
          //@ts-ignore
          setDidUserPassSnapshotAndCanVote(tokenUserWasHoldingAtSnapshotRawData / 1e18 > 0);
        } else {
          setDidUserPassSnapshotAndCanVote(false);
        }
      } else {
        setSnapshotTaken(false);
      }
      setCheckIfUserPassedSnapshotLoading(false);
    } catch (e) {
      console.error(e);
      setCheckIfUserPassedSnapshotLoading(false);
    }
  }

  /**
   * Update the amount of votes casted in this contest by the current user
   */
  async function updateCurrentUserVotes() {
    const contractConfig = await getContractConfig();

    if (!contractConfig) return;
    const accountData = getAccount();

    try {
      // get current block number
      const currentBlockNumber = await fetchBlockNumber();
      const timestamp = (await provider.getBlock(currentBlockNumber)).timestamp - 50; // (necessary to avoid block not mined error)
      const contracts = [
        // get current user availables votes now
        {
          ...contractConfig,
          functionName: "getVotes",
          args: [accountData?.address, timestamp],
        },
        // get votes cast by current user
        {
          ...contractConfig,
          functionName: "contestAddressTotalVotesCast",
          args: accountData?.address,
        },
      ];

      const results = await readContracts({ contracts });
      const currentUserAvailableVotesAmount = results[0];
      const currentUserTotalVotesCast = results[1];
      //@ts-ignore
      setCurrentUserTotalVotesCast(currentUserTotalVotesCast / 1e18);
      //@ts-ignore
      setCurrentUserAvailableVotesAmount(currentUserAvailableVotesAmount / 1e18 - currentUserTotalVotesCast / 1e18);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    checkCurrentUserAmountOfProposalTokens,
    checkIfCurrentUserQualifyToVote,
    updateCurrentUserVotes,
  };
}

export default useUser;
