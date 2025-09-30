import SubmissionPageDesktopBody from "./components/Body";
import SubmissionPageDesktopHeader from "./components/Header";
import SubmissionPageDesktopVotingArea from "./components/VotingArea";

const SubmissionPageDesktopLayout = () => {
  return (
    <div className="px-20 mt-8 animate-reveal">
      <div className="flex gap-4">
        <div className="flex flex-col gap-8 w-[60%]">
          <SubmissionPageDesktopHeader />
          <SubmissionPageDesktopBody />
        </div>
        <div className="w-[40%]">
          <SubmissionPageDesktopVotingArea />
        </div>
      </div>
    </div>
  );
};

export default SubmissionPageDesktopLayout;
