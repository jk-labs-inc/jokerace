import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";

const SubmittionPageDesktopEntryDelete = () => {
  const { proposalStaticData, contestAuthor } = useSubmissionPageStore(
    useShallow(state => ({
      proposalStaticData: state.proposalStaticData,
      contestAuthor: state.contestDetails.author,
    })),
  );
  const { address } = useAccount();

  // Server-rendered data should always be available, no loading states needed
  if (!contestAuthor || !proposalStaticData) return null;

  // Only show delete button if:
  // 1. User is the contest author, OR
  // 2. User is the proposal author
  if (address !== contestAuthor && address !== proposalStaticData.author) return null;

  return <div>SubmittionPageDesktopEntryDelete</div>;
};

export default SubmittionPageDesktopEntryDelete;
