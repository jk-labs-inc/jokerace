import SubmissionPageDesktopEntryNavigation from "./components/EntryNavigation";
import SubmissionPageDesktopVotes from "./components/Votes";
import SubmittionPageDesktopEntryDelete from "./components/EntryDelete";
import SubmissionPageDesktopHeaderShare from "./components/Share";

const SubmissionPageDesktopHeader = () => {
  return (
    <div className="flex items-center gap-4 px-10">
      <SubmissionPageDesktopVotes />
      <SubmissionPageDesktopHeaderShare />
      <SubmissionPageDesktopEntryNavigation />
      <div className="ml-auto">
        <SubmittionPageDesktopEntryDelete />
      </div>
    </div>
  );
};

export default SubmissionPageDesktopHeader;
