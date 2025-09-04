export const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const STANDARD_ANYONE_CAN_VOTE_GAS_LIMIT = 5000000;
export const ANYONE_CAN_VOTE_VERSION = "4.27";
export const VOTE_AND_EARN_VERSION = "6.1";

/**
 * Helper function to set multiple user vote qualification state values
 */
export const createUserVoteQualificationSetter = (
  setCurrentUserTotalVotesAmount: (amount: number) => void,
  setCurrentUserAvailableVotesAmount: (amount: number) => void,
  setIsCurrentUserVoteQualificationSuccess: (value: boolean) => void,
  setIsCurrentUserVoteQualificationLoading: (value: boolean) => void,
  setIsCurrentUserVoteQualificationError: (value: boolean) => void,
) => {
  return (totalVotes: number, availableVotes: number, success: boolean, loading: boolean, error: boolean) => {
    setCurrentUserTotalVotesAmount(totalVotes);
    setCurrentUserAvailableVotesAmount(availableVotes);
    setIsCurrentUserVoteQualificationSuccess(success);
    setIsCurrentUserVoteQualificationLoading(loading);
    setIsCurrentUserVoteQualificationError(error);
  };
};
