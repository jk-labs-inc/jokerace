/* eslint-disable react/no-unescaped-entities */
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { EMPTY_ROOT } from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { FC, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import { useAccount } from "wagmi";
import ContestPromptModal from "./components/Modal";
import ContestPromptPage from "./components/Page";
import SubmissionQualifierMessage from "./SubmissionQualifierMessage";

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
    isCurrentUserSubmitQualificationLoading,
    isCurrentUserSubmitQualificationError,
    contestMaxNumberSubmissionsPerUser,
    currentUserProposalCount,
    currentUserAvailableVotesAmount,
  } = useUserStore(state => state);

  if (type === "page") {
    return (
      <div className="flex flex-col gap-8">
        <ContestPromptPage prompt={prompt} />
        {isCurrentUserSubmitQualificationLoading ? (
          <Skeleton height={16} width={200} baseColor="#706f78" highlightColor="#FFE25B" duration={1} />
        ) : isCurrentUserSubmitQualificationError ? (
          <p className="text-[16px] text-negative-11 font-bold">
            ruh roh, we couldn't load your submission qualification state! please reload the page
          </p>
        ) : (
          <SubmissionQualifierMessage
            contestMaxNumberSubmissionsPerUser={contestMaxNumberSubmissionsPerUser}
            contestStatus={contestStatus}
            currentUserAvailableVotesAmount={currentUserAvailableVotesAmount}
            currentUserProposalCount={currentUserProposalCount}
            currentUserQualifiedToSubmit={currentUserQualifiedToSubmit}
            isDisconnected={isDisconnected}
            submissionMerkleRoot={submissionMerkleRoot}
          />
        )}
      </div>
    );
  } else {
    return <ContestPromptModal prompt={prompt} hidePrompt={hidePrompt} />;
  }
};

export default ContestPrompt;
