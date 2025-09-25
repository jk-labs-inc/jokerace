import VotingWidget from "@components/Voting";
import SubmissionPageDesktopVotingAreaTimer from "./components/Timer";
import SubmissionPageDesktopVotingAreaWidget from "./components/Widget";

const SubmissionPageDesktopVotingArea = () => {
  return (
    <div className="flex flex-col gap-6 items-start">
      <SubmissionPageDesktopVotingAreaTimer />
      <div className="bg-primary-1 rounded-4xl">
        <div className="p-4">
            <SubmissionPageDesktopVotingAreaWidget />
        </div>
      </div>
    </div>
  );
};

export default SubmissionPageDesktopVotingArea;
