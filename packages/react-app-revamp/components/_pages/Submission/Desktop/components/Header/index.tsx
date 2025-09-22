import SubmissionPageDesktopEntryNavigation from "./components/EntryNavigation";
import SubmissionPageDesktopVotes from "./components/Votes";

interface SubmissionPageDesktopHeaderProps {
  contestInfo: {
    address: string;
    chain: string;
    chainId: number;
  };
  proposalId: string;
}

const SubmissionPageDesktopHeader = ({ contestInfo, proposalId }: SubmissionPageDesktopHeaderProps) => {
  return (
    <div className="flex items-center pl-10">
      <SubmissionPageDesktopVotes contestInfo={contestInfo} proposalId={proposalId} />
      <SubmissionPageDesktopEntryNavigation contestInfo={contestInfo} proposalId={proposalId} />
    </div>
  );
};

export default SubmissionPageDesktopHeader;
