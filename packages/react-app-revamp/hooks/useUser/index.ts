import { ContractConfig } from "@hooks/useContest";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import { useUserStore } from "./store";
import { useAnyoneCanVote } from "./useAnyoneCanVote";
import { useSubmitQualification } from "./useSubmitQualification";
import { createUserVoteQualificationSetter } from "./utils";
export { EMPTY_ROOT } from "./utils";

export function useUser() {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const { address: userAddress } = useAccount();
  const {
    setCurrentUserAvailableVotesAmount,
    setCurrentUserTotalVotesAmount,
    setIsCurrentUserVoteQualificationLoading,
    setIsCurrentUserVoteQualificationSuccess,
    setIsCurrentUserVoteQualificationError,
  } = useUserStore(state => state);

  const { checkIfCurrentUserQualifyToSubmit } = useSubmitQualification(userAddress);
  const { checkAnyoneCanVoteUserQualification } = useAnyoneCanVote(
    userAddress,
    contestConfig.address,
    contestConfig.chainId,
  );

  const setUserVoteQualification = createUserVoteQualificationSetter(
    setCurrentUserTotalVotesAmount,
    setCurrentUserAvailableVotesAmount,
    setIsCurrentUserVoteQualificationSuccess,
    setIsCurrentUserVoteQualificationLoading,
    setIsCurrentUserVoteQualificationError,
  );

  /**
   * Check if the current user qualifies to vote (everyone can vote, just check balance)
   */
  const checkIfCurrentUserQualifyToVote = async (contractConfig: ContractConfig) => {
    setIsCurrentUserVoteQualificationLoading(true);

    if (!contractConfig.abi) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    await checkAnyoneCanVoteUserQualification(contractConfig.abi, setUserVoteQualification);
  };

  /**
   * Update the current user's vote amounts after casting votes
   */
  //TODO: change this to Abi type
  const updateCurrentUserVotes = async (abi: any) => {
    setIsCurrentUserVoteQualificationLoading(true);

    if (!abi) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    await checkAnyoneCanVoteUserQualification(abi, setUserVoteQualification);
  };

  return {
    checkIfCurrentUserQualifyToVote,
    checkIfCurrentUserQualifyToSubmit,
    updateCurrentUserVotes,
  };
}

export default useUser;
