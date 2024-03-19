import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalSendProposal from "@components/_pages/DialogModalSendProposal";
import ListProposals from "@components/_pages/ListProposals";
import useContest from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import ContestPrompt from "../components/Prompt";
import ProposalStatistics from "../components/ProposalStatistics";
import ContestStickyCards from "../components/StickyCards";
import ContestTimeline from "../components/Timeline";

const ContestTab = () => {
  const { contestPrompt } = useContestStore(state => state);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { contestStatus } = useContestStatusStore(state => state);
  const {
    contestMaxNumberSubmissionsPerUser,
    currentUserQualifiedToSubmit,
    currentUserProposalCount,
    isCurrentUserSubmitQualificationLoading,
  } = useUserStore(state => state);
  const { checkIfCurrentUserQualifyToVote, checkIfCurrentUserQualifyToSubmit } = useUser();
  const { isListProposalsLoading, isListProposalsSuccess } = useProposalStore(state => state);
  const { isLoading: isContestLoading, isSuccess: isContestSuccess } = useContest();
  const {
    isModalOpen: isSubmitProposalModalOpen,
    setIsModalOpen: setIsSubmitProposalModalOpen,
    setIsSuccess: setIsSubmitProposalSuccess,
  } = useSubmitProposalStore(state => state);
  const qualifiedToSubmit =
    currentUserQualifiedToSubmit && currentUserProposalCount < contestMaxNumberSubmissionsPerUser;
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [blurProposals, setBlurProposals] = useState(false);
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;

  const renderSubmitButton = () => {
    if (!isConnected) {
      return (
        <ButtonV3
          colorClass="bg-gradient-vote rounded-[40px]"
          size={isMobile ? ButtonSize.FULL : ButtonSize.EXTRA_LARGE_LONG}
          onClick={openConnectModal}
        >
          connect wallet to submit entry
        </ButtonV3>
      );
    }

    if (isCurrentUserSubmitQualificationLoading) return null;

    if (qualifiedToSubmit)
      return (
        <ButtonV3
          colorClass="bg-gradient-vote rounded-[40px]"
          size={isMobile ? ButtonSize.FULL : ButtonSize.EXTRA_LARGE_LONG}
          onClick={() => {
            setIsSubmitProposalSuccess(false);
            setIsSubmitProposalModalOpen(!isSubmitProposalModalOpen);
          }}
        >
          submit a response
        </ButtonV3>
      );
  };

  return (
    <div>
      <div className="mt-8">
        <ContestTimeline />
      </div>

      <div className="mt-8">
        <ContestPrompt prompt={contestPrompt} type="page" />
      </div>
      {contestStatus === ContestStatus.SubmissionOpen && <div className="mt-8">{renderSubmitButton()}</div>}
      <ContestStickyCards />

      <div className={`mt-4 ${isInPwaMode ? "mb-12" : "mb-0"}`}>
        <div className="flex flex-col gap-5">
          {contestStatus !== ContestStatus.ContestOpen && !isContestLoading && (
            <ProposalStatistics
              contestStatus={contestStatus}
              onMenuStateChange={(value: boolean) => setBlurProposals(value)}
            />
          )}

          {!isContestLoading && !isListProposalsLoading && isContestSuccess && isListProposalsSuccess && (
            <div
              className={`animate-appear ${contestStatus !== ContestStatus.SubmissionOpen ? "mt-4" : "mt-0"} ${
                blurProposals ? "blurProposals" : ""
              }`}
            >
              <ListProposals />
            </div>
          )}
        </div>
      </div>

      <DialogModalSendProposal isOpen={isSubmitProposalModalOpen} setIsOpen={setIsSubmitProposalModalOpen} />
    </div>
  );
};

export default ContestTab;
