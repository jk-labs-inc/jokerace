import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { getAccount, readContract } from "@wagmi/core";
import MerkleTree from "merkletreejs";
import { useRouter } from "next/router";
import { useAccount, useNetwork } from "wagmi";
import { useUserStore } from "./store";

export function useUser() {
  const { address: userAddress } = useAccount();
  const {
    setCurrentUserQualifiedToSubmit,
    setCurrentUserAvailableVotesAmount,
    setCurrentUserTotalVotesAmount,
    setCurrentUserProposalCount,
    setCurrentuserTotalVotesCast,
    currentUserTotalVotesAmount,
  } = useUserStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading } = useProposalStore(state => state);
  const {
    setIsSuccess: setIsContestSuccess,
    setIsLoading: setIsContestLoading,
    setError: setContestError,
    voters,
    submitters,
  } = useContestStore(state => state);
  const { chain } = useNetwork();
  const { asPath } = useRouter();
  const [chainName, address] = asPath.split("/").slice(2, 4);
  const lowerCaseChainName = chainName.replace(/\s+/g, "").toLowerCase();

  // Generate config for the contract
  async function getContractConfig() {
    const { abi } = await getContestContractVersion(address, chainName);

    if (abi === null) {
      toastError(`This contract doesn't exist on ${chain?.name ?? "this chain"}.`);
      setContestError({ message: `This contract doesn't exist on ${chain?.name ?? "this chain"}.` });
      setIsContestSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsContestLoading(false);
      return;
    }

    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
      chainId: chains.find(c => c.name.replace(/\s+/g, "").toLowerCase() === lowerCaseChainName)?.id,
    };

    return contractConfig;
  }

  async function checkSubmitters(one_ks: number) {
    return submitters.slice(one_ks * 1000, (one_ks + 1) * 1000).some(submitter => submitter.address === userAddress);
  }

  const checkIfCurrentUserQualifyToSubmit = async (
    submissionMerkleTree: MerkleTree,
    contestMaxNumberSubmissionsPerUser: number,
  ) => {
    const contractConfig = await getContractConfig();
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    if (!userAddress || !contractConfig) return;

    if (submissionMerkleTree.getHexRoot() === "0x") {
      const numOfSubmittedProposals = await readContract({
        ...contractConfig,
        functionName: "getNumSubmissions",
        args: userAddress,
      });

      if (numOfSubmittedProposals.gt(0) && numOfSubmittedProposals.gte(contestMaxNumberSubmissionsPerUser)) {
        setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
        return;
      }

      setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
      setCurrentUserQualifiedToSubmit(true);
    } else {
      try {
        const tasks = [];
        var one_ks = 0;
        while ((one_ks * 1000) < submitters.length) {
          tasks.push(checkSubmitters(one_ks))
          one_ks += 1;
        }
        const user_can_submit = (await Promise.all(tasks)).flat();
        if (user_can_submit) {
          const numOfSubmittedProposals = await readContract({
            ...contractConfig,
            functionName: "getNumSubmissions",
            args: userAddress,
          });

          if (numOfSubmittedProposals.gt(0) && numOfSubmittedProposals.gte(contestMaxNumberSubmissionsPerUser)) {
            setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
            return;
          }

          setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
          setCurrentUserQualifiedToSubmit(true);
        } else {
          setCurrentUserQualifiedToSubmit(false);
        }
      } catch (error) {
        console.error("Error performing lookup in 'contest_participants_v3':", error);
        setCurrentUserQualifiedToSubmit(false);
      }
    }
  };

  async function checkVoters(one_ks: number) {
    return voters.slice(one_ks * 1000, (one_ks + 1) * 1000).filter(voter => voter.address === userAddress);
  }

  /**
   * Check if the current user qualify to vote for this contest
   */
  async function checkIfCurrentUserQualifyToVote() {
    if (!userAddress) return;

    try {
      const tasks = [];
      var one_ks = 0;
      while ((one_ks * 1000) < voters.length) {
        tasks.push(checkVoters(one_ks))
        one_ks += 1;
      }
      const user_votes = (await Promise.all(tasks)).flat();
      if (user_votes.length > 0) {
        const contractConfig = await getContractConfig();
        if (!contractConfig) return;

        const currentUserTotalVotesCast = await readContract({
          ...contractConfig,
          functionName: "contestAddressTotalVotesCast",
          args: userAddress,
        });

        const userVotes = user_votes[0].numVotes;
        //@ts-ignore
        const castVotes = currentUserTotalVotesCast / 1e18;

        if (castVotes > 0) {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(userVotes - castVotes);
          setCurrentuserTotalVotesCast(castVotes);
        } else {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(userVotes);
          setCurrentuserTotalVotesCast(castVotes);
        }
      } else {
        setCurrentUserTotalVotesAmount(0);
        setCurrentUserAvailableVotesAmount(0);
        setCurrentuserTotalVotesCast(0);
      }
    } catch (error) {
      console.error("Error performing lookup in 'contest_participants_v3':", error);
      setCurrentUserTotalVotesAmount(0);
      setCurrentUserAvailableVotesAmount(0);
      setCurrentuserTotalVotesCast(0);
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
      const currentUserTotalVotesCast = await readContract({
        ...contractConfig,
        functionName: "contestAddressTotalVotesCast",
        args: accountData?.address,
      });

      //@ts-ignore
      setCurrentUserAvailableVotesAmount(currentUserTotalVotesAmount - currentUserTotalVotesCast / 1e18);
      //@ts-ignore
      setCurrentuserTotalVotesCast(currentUserTotalVotesCast / 1e18);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    checkIfCurrentUserQualifyToVote,
    checkIfCurrentUserQualifyToSubmit,
    updateCurrentUserVotes,
  };
}

export default useUser;
