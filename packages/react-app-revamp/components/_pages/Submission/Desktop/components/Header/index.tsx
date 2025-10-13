import SubmissionPageDesktopEntryNavigation from "./components/EntryNavigation";
import SubmissionPageDesktopVotes from "./components/Votes";

const SubmissionPageDesktopHeader = () => {
  return (
    <div className="flex items-center gap-4 px-10">
      <SubmissionPageDesktopVotes />
      {/* <SubmissionPageDesktopHeaderShare /> TODO: add share button back when we decide on design */}
      <SubmissionPageDesktopEntryNavigation />
    </div>
  );
};

export default SubmissionPageDesktopHeader;
