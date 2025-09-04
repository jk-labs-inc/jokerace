import { supabase } from "@config/supabase";
import { config } from "@config/wagmi";
import { ContractConfig } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { readContract } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { Abi } from "viem";
import { useUserStore } from "./store";
import { ANYONE_CAN_VOTE_VERSION, EMPTY_ROOT, VOTE_AND_EARN_VERSION, createUserVoteQualificationSetter } from "./utils";

export const useVoteQualification = (
  userAddress: `0x${string}` | undefined,
  contestAddressLowerCase: string,
  lowerCaseChainName: string,
  address: string,
  chainId: number,
) => {
  const { setVotingMerkleRoot, setAnyoneCanVote } = useContestStore(state => state);
  const {
    setCurrentUserAvailableVotesAmount,
    setCurrentUserTotalVotesAmount,
    setCurrentuserTotalVotesCast,
    setIsCurrentUserVoteQualificationLoading,
    setIsCurrentUserVoteQualificationSuccess,
    setIsCurrentUserVoteQualificationError,
  } = useUserStore(state => state);

  const setUserVoteQualification = createUserVoteQualificationSetter(
    setCurrentUserTotalVotesAmount,
    setCurrentUserAvailableVotesAmount,
    setIsCurrentUserVoteQualificationSuccess,
    setIsCurrentUserVoteQualificationLoading,
    setIsCurrentUserVoteQualificationError,
  );

  /**
   * Check if the current user qualify to vote for this contest
   */
  const checkIfCurrentUserQualifyToVote = async (
    contractConfig: ContractConfig,
    version: string,
    checkAnyoneCanVoteUserQualification: (abi: any, version: string) => Promise<void>,
  ) => {
    setIsCurrentUserVoteQualificationLoading(true);

    if (!contractConfig.abi) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    // For version 5.15+, votingMerkleRoot is deprecated
    // Go straight to anyone-can-vote qualification check
    if (compareVersions(version, VOTE_AND_EARN_VERSION) >= 0) {
      if (!userAddress) return;

      setAnyoneCanVote(true);

      await checkAnyoneCanVoteUserQualification(contractConfig.abi, version);
      return;
    }

    const votingMerkleRoot = (await readContract(config, {
      address: address as `0x${string}`,
      abi: contractConfig.abi as Abi,
      chainId: chainId,
      functionName: "votingMerkleRoot",
    })) as string;

    const anyoneCanVote = votingMerkleRoot === EMPTY_ROOT;
    setVotingMerkleRoot(votingMerkleRoot);
    setAnyoneCanVote(anyoneCanVote);

    if (!userAddress) return;

    if (compareVersions(version, ANYONE_CAN_VOTE_VERSION) >= 0) {
      if (anyoneCanVote) {
        await checkAnyoneCanVoteUserQualification(contractConfig.abi, version);
        return;
      }
    }

    try {
      // Perform a lookup in the 'contest_participants_v3' table.
      const { data } = await supabase
        .from("contest_participants_v3")
        .select("num_votes")
        .eq("user_address", userAddress)
        .eq("contest_address", contestAddressLowerCase)
        .eq("network_name", lowerCaseChainName);

      if (data && data.length > 0 && data[0].num_votes > 0) {
        const currentUserTotalVotesCast = (await readContract(config, {
          ...contractConfig,
          functionName: "contestAddressTotalVotesCast",
          args: [userAddress],
        })) as bigint;

        const userVotes = data[0].num_votes;

        const availableVotes = BigInt(userVotes) - currentUserTotalVotesCast / BigInt(1e18);

        if (currentUserTotalVotesCast > 0) {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(Number(availableVotes));
          setCurrentuserTotalVotesCast(Number(currentUserTotalVotesCast));
          setIsCurrentUserVoteQualificationSuccess(true);
          setIsCurrentUserVoteQualificationLoading(false);
        } else {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(userVotes);
          setCurrentuserTotalVotesCast(Number(currentUserTotalVotesCast));
          setIsCurrentUserVoteQualificationSuccess(true);
          setIsCurrentUserVoteQualificationLoading(false);
        }
      } else {
        setCurrentUserTotalVotesAmount(0);
        setCurrentUserAvailableVotesAmount(0);
        setCurrentuserTotalVotesCast(0);
        setIsCurrentUserVoteQualificationSuccess(true);
        setIsCurrentUserVoteQualificationLoading(false);
      }
    } catch (error) {
      console.error("Error performing lookup in 'contest_participants_v3':", error);
      setCurrentUserTotalVotesAmount(0);
      setCurrentUserAvailableVotesAmount(0);
      setCurrentuserTotalVotesCast(0);
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationLoading(false);
      setIsCurrentUserVoteQualificationSuccess(false);
    }
  };

  return {
    checkIfCurrentUserQualifyToVote,
    setUserVoteQualification,
  };
};
