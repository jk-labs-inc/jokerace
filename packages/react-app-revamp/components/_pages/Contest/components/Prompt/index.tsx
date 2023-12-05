/* eslint-disable react/no-unescaped-entities */
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useUserStore } from "@hooks/useUser/store";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { useAccount } from "wagmi";
import SubmissionQualifierMessage from "./SubmissionQualifierMessage";
import ContestPromptModal from "./components/Modal";
import ContestPromptPage from "./components/Page";

interface ContestPromptProps {
  prompt: string;
  type: "page" | "modal";
  hidePrompt?: boolean;
}

const ContestPrompt: FC<ContestPromptProps> = ({ prompt, type, hidePrompt = false }) => {
  const { isConnected } = useAccount();
  const contestStatus = useContestStatusStore(state => state.contestStatus);
  const isVotingOpenOrClosed =
    contestStatus === ContestStatus.VotingOpen || contestStatus === ContestStatus.VotingClosed;
  const { submissionMerkleRoot } = useContestStore(state => state);
  const {
    currentUserQualifiedToSubmit,
    isCurrentUserSubmitQualificationLoading,
    isCurrentUserSubmitQualificationError,
    contestMaxNumberSubmissionsPerUser,
    currentUserProposalCount,
    currentUserAvailableVotesAmount,
  } = useUserStore(state => state);

  const renderQualifierMessage = () => {
    if (isVotingOpenOrClosed) return null;
    if (isCurrentUserSubmitQualificationLoading) {
      return <Skeleton height={16} width={200} baseColor="#706f78" highlightColor="#FFE25B" duration={1} />;
    } else if (isCurrentUserSubmitQualificationError) {
      return (
        <p className="text-[16px] text-negative-11 font-bold">
          ruh roh, we couldn't load your submission qualification state! please reload the page
        </p>
      );
    } else {
      return (
        <SubmissionQualifierMessage
          contestMaxNumberSubmissionsPerUser={contestMaxNumberSubmissionsPerUser}
          contestStatus={contestStatus}
          currentUserAvailableVotesAmount={currentUserAvailableVotesAmount}
          currentUserProposalCount={currentUserProposalCount}
          currentUserQualifiedToSubmit={currentUserQualifiedToSubmit}
          submissionMerkleRoot={submissionMerkleRoot}
        />
      );
    }
  };

  if (type === "page") {
    return (
      <div className="flex flex-col gap-8">
        <ContestPromptPage prompt={prompt} />
        {isConnected && renderQualifierMessage()}
      </div>
    );
  } else {
    return <ContestPromptModal prompt={prompt} hidePrompt={hidePrompt} />;
  }
};

export default ContestPrompt;
