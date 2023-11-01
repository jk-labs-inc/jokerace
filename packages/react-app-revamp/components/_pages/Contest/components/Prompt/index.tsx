import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { EMPTY_ROOT } from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { FC, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import { useAccount } from "wagmi";
import ContestPromptModal from "./components/Modal";
import ContestPromptPage from "./components/Page";

interface ContestPromptProps {
  prompt: string;
  type: "page" | "modal";
  hidePrompt?: boolean;
}

const ContestPrompt: FC<ContestPromptProps> = ({ prompt, type, hidePrompt = false }) => {
  const { isDisconnected } = useAccount();
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const { submissionMerkleRoot } = useContestStore(state => state);
  const {
    currentUserQualifiedToSubmit,
    isLoading,
    contestMaxNumberSubmissionsPerUser,
    currentUserProposalCount,
    currentUserAvailableVotesAmount,
  } = useUserStore(state => state);
  const anyoneCanSubmit = submissionMerkleRoot === EMPTY_ROOT;

  const qualifiedToSubmitMessage = useMemo(() => {
    const isContestOpen = contestStatus === ContestStatus.ContestOpen;
    const isVotingOpenOrClosed =
      contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed;
    const hasReachedMaxSubmissions = currentUserProposalCount >= contestMaxNumberSubmissionsPerUser;
    const canSubmit = anyoneCanSubmit || currentUserQualifiedToSubmit;
    const canVote = currentUserAvailableVotesAmount > 0;

    if (isLoading) {
      return <Skeleton height={16} width={200} baseColor="#706f78" highlightColor="#FFE25B" duration={1} />;
    }

    if (isVotingOpenOrClosed || isDisconnected) {
      return null;
    }

    if (isContestOpen) {
      if (canSubmit) {
        return (
          <p className="text-[16px] text-primary-10">
            good news: you qualify to submit a response once the contest opens
          </p>
        );
      }
      if (!currentUserQualifiedToSubmit) {
        return (
          <p className="text-[16px] text-primary-10">
            unfortunately, your wallet wasn’t allowlisted to submit in this contest.
          </p>
        );
      }
    }

    if (contestStatus === ContestStatus.SubmissionOpen) {
      if (hasReachedMaxSubmissions) {
        return <p className="text-[16px] text-primary-10">you’ve reached your max submissions with this account</p>;
      }
      if (!currentUserQualifiedToSubmit) {
        if (canVote) {
          return (
            <p className="text-[16px] text-primary-10">
              unfortunately, your wallet wasn’t allowlisted to submit in this contest, but you <i>were</i> allowlisted
              to vote
            </p>
          );
        }
        return (
          <p className="text-[16px] text-primary-10">
            unfortunately, your wallet wasn’t allowlisted to submit in this contest.
          </p>
        );
      }
    }

    return null;
  }, [
    contestStatus,
    anyoneCanSubmit,
    isDisconnected,
    isLoading,
    currentUserQualifiedToSubmit,
    currentUserAvailableVotesAmount,
    currentUserProposalCount,
    contestMaxNumberSubmissionsPerUser,
  ]);

  if (type === "page") {
    return (
      <div className="flex flex-col gap-8">
        <ContestPromptPage prompt={prompt} />
        {qualifiedToSubmitMessage}
      </div>
    );
  } else {
    return <ContestPromptModal prompt={prompt} hidePrompt={hidePrompt} />;
  }
};

export default ContestPrompt;
