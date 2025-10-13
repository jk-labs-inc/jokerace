interface UseVotesFromInputProps {
  inputValue: string;
  costToVote: string;
}

/**
 * Calculate votes based on user's input value
 * @returns number of votes user will get for their input
 */
export const useVotesFromInput = ({ inputValue, costToVote }: UseVotesFromInputProps): number => {
  const inputValueNum = parseFloat(inputValue);
  const costToVoteNum = parseFloat(costToVote);

  if (isNaN(inputValueNum) || costToVoteNum <= 0) {
    return 0;
  }

  return Math.floor(inputValueNum / costToVoteNum);
};
