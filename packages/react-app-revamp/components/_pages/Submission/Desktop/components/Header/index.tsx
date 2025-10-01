import useEntryData from "@components/_pages/Submission/hooks/useEntryData";
import useContestConfigStore from "@hooks/useContestConfig/store";
import SubmissionPageDesktopEntryNavigation from "./components/EntryNavigation";
import SubmissionPageDesktopHeaderLoadingSkeleton from "./components/LoadingSkeleton";
import SubmissionPageDesktopVotes from "./components/Votes";

const SubmissionPageDesktopHeader = () => {
  const { contestConfig, proposalId } = useContestConfigStore(state => state);
  const { isLoadingProposal } = useEntryData({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
    proposalId: proposalId,
  });

  if (isLoadingProposal) {
    return <SubmissionPageDesktopHeaderLoadingSkeleton />;
  }

  return (
    <div className="flex items-center gap-4 pl-10">
      <SubmissionPageDesktopVotes />
      <SubmissionPageDesktopEntryNavigation />
    </div>
  );
};

export default SubmissionPageDesktopHeader;
