import { config } from "@config/wagmi";
import { readContract } from "@wagmi/core";
import { Abi } from "viem";
import { useUserStore } from "./store";

export const useVoteUpdates = (userAddress: `0x${string}` | undefined, address: string) => {
  const {
    setCurrentUserAvailableVotesAmount,
    setCurrentuserTotalVotesCast,
    currentUserTotalVotesAmount,
    setIsCurrentUserVoteQualificationLoading,
    setIsCurrentUserVoteQualificationSuccess,
    setIsCurrentUserVoteQualificationError,
  } = useUserStore(state => state);

  /**
   * Update the amount of votes casted in this contest by the current user
   */
  const updateCurrentUserVotes = async (
    abi: any,
    version: string,
    anyoneCanVote: boolean | undefined,
    checkAnyoneCanVoteUserQualification: (abi: any, version: string) => Promise<void>,
  ) => {
    setIsCurrentUserVoteQualificationLoading(true);

    if (!abi) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    if (anyoneCanVote) {
      await checkAnyoneCanVoteUserQualification(abi, version);
      return;
    }

    try {
      const currentUserTotalVotesCastRaw = (await readContract(config, {
        address: address as `0x${string}`,
        abi: abi as Abi,
        functionName: "contestAddressTotalVotesCast",
        args: [userAddress],
      })) as bigint;

      const currentUserAvailableVotesAmountRaw =
        BigInt(currentUserTotalVotesAmount) - currentUserTotalVotesCastRaw / BigInt(1e18);
      const currentUserTotalVotesCastFinalRaw = currentUserTotalVotesCastRaw / BigInt(1e18);

      setCurrentUserAvailableVotesAmount(Number(currentUserAvailableVotesAmountRaw));
      setCurrentuserTotalVotesCast(Number(currentUserTotalVotesCastFinalRaw));
      setIsCurrentUserVoteQualificationSuccess(true);
      setIsCurrentUserVoteQualificationLoading(false);
    } catch (e) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
    }
  };

  return {
    updateCurrentUserVotes,
  };
};
