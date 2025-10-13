interface UseCurrentUserVotesProps {
  spendableBalance: string;
  costToVote: string;
}

/**
 * Calculate total votes user can cast based on their spendable balance
 * @returns number of votes
 */
export const useCurrentUserVotes = ({ spendableBalance, costToVote }: UseCurrentUserVotesProps): number => {
  const spendableBalanceNum = parseFloat(spendableBalance);
  const costToVoteNum = parseFloat(costToVote);

  return costToVoteNum > 0 ? Math.floor(spendableBalanceNum / costToVoteNum) : 0;
};
