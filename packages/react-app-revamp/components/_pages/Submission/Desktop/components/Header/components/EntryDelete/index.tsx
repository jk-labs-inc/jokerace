import useContestVoteTimer, { VotingStatus } from "@components/_pages/Submission/hooks/useContestVoteTimer";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import SubmissionPageDesktopHeaderEntryDeleteHandler from "./components/Handler";

const SubmittionPageDesktopEntryDelete = () => {
  const voteTimings = useSubmissionPageStore(useShallow(state => state.voteTimings));
  const { votingStatus } = useContestVoteTimer({
    voteStart: voteTimings?.voteStart ?? null,
    contestDeadline: voteTimings?.contestDeadline ?? null,
  });
  const { proposalStaticData, contestAuthor } = useSubmissionPageStore(
    useShallow(state => ({
      proposalStaticData: state.proposalStaticData,
      contestAuthor: state.contestDetails.author,
    })),
  );
  const { address } = useAccount();

  if (!contestAuthor || !proposalStaticData) return null;

  if (
    (address !== contestAuthor && address !== proposalStaticData.author) ||
    votingStatus === VotingStatus.VotingOpen ||
    votingStatus === VotingStatus.VotingClosed
  )
    return null;

  return <SubmissionPageDesktopHeaderEntryDeleteHandler />;
};

export default SubmittionPageDesktopEntryDelete;
