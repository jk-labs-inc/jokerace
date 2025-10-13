import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalSendProposal from "@components/_pages/DialogModalSendProposal";
import ListProposals from "@components/_pages/ListProposals";
import useContest from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { useUserStore } from "@hooks/useUserSubmitQualification/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import ContestPrompt from "../components/Prompt";
import ProposalStatistics from "../components/ProposalStatistics";
import ContestStickyCards from "../components/StickyCards";
import EntryPreviewTitleToggle from "../components/EntryPreviewTitleToggle";

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
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;

  const renderSubmitButton = () => {
    if (isContestCanceled) return null;

    if (!isConnected) {
      return (
        <ButtonV3
          colorClass="bg-gradient-vote rounded-[40px]"
          size={isMobile ? ButtonSize.EXTRA_LARGE_LONG_MOBILE : ButtonSize.EXTRA_LARGE_LONG}
          onClick={openConnectModal}
        >
          connect wallet to enter contest
        </ButtonV3>
      );
    }

    if (isCurrentUserSubmitQualificationLoading) return null;

    if (qualifiedToSubmit)
      return (
        <ButtonV3
          colorClass="bg-gradient-purple rounded-[40px]"
          textColorClass="text-[16px] md:text-[20px] font-bold text-true-black"
          size={isMobile ? ButtonSize.EXTRA_LARGE_LONG_MOBILE : ButtonSize.EXTRA_LARGE_LONG}
          onClick={() => {
            setIsSubmitProposalSuccess(false);
            setIsSubmitProposalModalOpen(!isSubmitProposalModalOpen);
          }}
        >
          enter contest
        </ButtonV3>
      );
  };

  return (
    <div className="animate-reveal">
      <div className="mt-4 md:mt-6">
        <div className="flex flex-col gap-6">
          {isContestCanceled ? (
            <div className="flex">
              <div className="inline-block border border-negative-11 py-2 px-4 rounded-lg">
                <p className="text-negative-11 text-[16px] md:text-[20px] font-bold text-center">
                  {isMobile
                    ? "this contest was canceled by the creator"
                    : "This contest was canceled by the creator and is no longer active"}
                </p>
              </div>
            </div>
          ) : null}
          <ContestPrompt prompt={contestPrompt} type="page" />
        </div>
      </div>
      {contestStatus === ContestStatus.SubmissionOpen && (
        <div className="fixed z-50 bottom-20 left-0 right-0 flex w-full justify-center md:justify-normal md:static md:mt-8">
          {renderSubmitButton()}
        </div>
      )}
      <ContestStickyCards />

      <div className={`mt-4 ${isInPwaMode ? "mb-12" : "mb-0"}`}>
        <div className="flex flex-col gap-2">
          {contestStatus !== ContestStatus.ContestOpen && !isContestLoading && (
            <div className="flex items-center gap-12 pb-4 ">
              <ProposalStatistics contestStatus={contestStatus} />
              <EntryPreviewTitleToggle />
            </div>
          )}

          {!isContestLoading && !isListProposalsLoading && isContestSuccess && isListProposalsSuccess && (
            <div className="animate-reveal">
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
