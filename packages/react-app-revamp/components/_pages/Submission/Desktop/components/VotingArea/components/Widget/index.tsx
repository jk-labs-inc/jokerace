import VotingWidget from "@components/Voting";

const SubmissionPageDesktopVotingAreaWidget = () => {
  return (
    <div className="pl-8 pt-4 pb-6 pr-12 bg-gradient-voting-area rounded-4xl">
      <VotingWidget
        amountOfVotes={100}
        costToVote={100}
        chainId={1}
        balanceData={undefined}
        isLoading={false}
        isVotingClosed={false}
        isContestCanceled={false}
        insufficientBalance={false}
        isCorrectNetwork={false}
      />
    </div>
  );
};

export default SubmissionPageDesktopVotingAreaWidget;
