import { Abi } from "viem";
import SubmissionPageDesktopEntryNavigation from "./components/EntryNavigation";
import SubmissionPageDesktopVotes from "./components/Votes";

const SubmissionPageDesktopHeader = () => {
  return (
    <div className="flex items-center pl-10">
      <SubmissionPageDesktopVotes />
      <SubmissionPageDesktopEntryNavigation />
    </div>
  );
};

export default SubmissionPageDesktopHeader;
