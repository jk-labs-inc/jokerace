import SubmissionPageDesktopBody from "./components/Body";
import SubmissionPageDesktopHeader from "./components/Header";
import SubmissionPageDesktopVotingArea from "./components/VotingArea";
import SubmissionPageDesktopVotingAreaTimer from "./components/VotingArea/components/Timer";

const SubmissionPageDesktopLayout = () => {
  return (
    <div className="px-20 mt-8 animate-fade-in">
      <div className="grid grid-cols-[50%_50%] xl:grid-cols-[60%_40%] gap-x-4 gap-y-4 items-center">
        <div className="min-w-0">
          <SubmissionPageDesktopHeader />
        </div>
        <div className="min-w-0">
          <SubmissionPageDesktopVotingAreaTimer />
        </div>

        <div className="min-w-0 self-stretch">
          <SubmissionPageDesktopBody />
        </div>
        <div className="min-w-0 self-stretch">
          <SubmissionPageDesktopVotingArea />
        </div>
      </div>
    </div>
  );
};

export default SubmissionPageDesktopLayout;
