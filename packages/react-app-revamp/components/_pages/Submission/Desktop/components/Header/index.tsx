import SubmissionDelete from "@components/_pages/Submission/shared/components/SubmissionDelete";
import SubmissionPageDesktopEntryNavigation from "./components/EntryNavigation";
import SubmissionPageDesktopHeaderShare from "./components/Share";
import SubmissionPageDesktopVotes from "./components/Votes";

const SubmissionPageDesktopHeader = () => {
  return (
    <div className="flex items-center gap-4 px-10">
      <SubmissionPageDesktopVotes />
      {/* <SubmissionPageDesktopHeaderShare /> TODO: add share button back when we decide on design */}
      <SubmissionPageDesktopEntryNavigation />
      <div className="ml-auto">
        <SubmissionDelete />
      </div>
    </div>
  );
};

export default SubmissionPageDesktopHeader;
