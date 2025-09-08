import { ContractConfig } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { useUserStore } from "./store";
import { createUserVoteQualificationSetter } from "./utils";

export const useVoteQualification = (userAddress: `0x${string}` | undefined) => {
  const { setAnyoneCanVote } = useContestStore(state => state);
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
    if (!userAddress) return;

    setIsCurrentUserVoteQualificationLoading(true);

    if (!contractConfig.abi) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    setAnyoneCanVote(true);

    await checkAnyoneCanVoteUserQualification(contractConfig.abi, version);
  };

  return {
    checkIfCurrentUserQualifyToVote,
    setUserVoteQualification,
  };
};
