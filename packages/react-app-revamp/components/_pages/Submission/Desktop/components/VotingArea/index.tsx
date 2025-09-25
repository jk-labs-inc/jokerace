import VotingWidget from "@components/Voting";
import SubmissionPageDesktopVotingAreaTimer from "./components/Timer";

const SubmissionPageDesktopVotingArea = () => {
  return (
    <div className="flex flex-col gap-6 items-start">
      <SubmissionPageDesktopVotingAreaTimer />
      {/* <VotingWidget amountOfVotes={100} /> */}
    </div>
  );
};

export default SubmissionPageDesktopVotingArea;
