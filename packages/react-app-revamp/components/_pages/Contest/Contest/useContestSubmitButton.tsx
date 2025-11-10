import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { AnyoneCanSubmit, useUserStore } from "@hooks/useUserSubmitQualification/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";

export const useContestSubmitButton = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const {
    contestMaxNumberSubmissionsPerUser,
    currentUserQualifiedToSubmit,
    currentUserProposalCount,
    isCurrentUserSubmitQualificationLoading,
    anyoneCanSubmit,
  } = useUserStore(
    useShallow(state => ({
      contestMaxNumberSubmissionsPerUser: state.contestMaxNumberSubmissionsPerUser,
      currentUserQualifiedToSubmit: state.currentUserQualifiedToSubmit,
      currentUserProposalCount: state.currentUserProposalCount,
      isCurrentUserSubmitQualificationLoading: state.isCurrentUserSubmitQualificationLoading,
      anyoneCanSubmit: state.anyoneCanSubmit,
    })),
  );
  const {
    isModalOpen: isSubmitProposalModalOpen,
    setIsModalOpen: setIsSubmitProposalModalOpen,
    setIsSuccess: setIsSubmitProposalSuccess,
  } = useSubmitProposalStore(
    useShallow(state => ({
      isModalOpen: state.isModalOpen,
      setIsModalOpen: state.setIsModalOpen,
      setIsSuccess: state.setIsSuccess,
    })),
  );
  const contestState = useContestStateStore(useShallow(state => state.contestState));
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const qualifiedToSubmit =
    currentUserQualifiedToSubmit && currentUserProposalCount < contestMaxNumberSubmissionsPerUser;

  const handleEnterContest = () => {
    setIsSubmitProposalSuccess(false);
    setIsSubmitProposalModalOpen(!isSubmitProposalModalOpen);
  };

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

    if (qualifiedToSubmit) {
      return (
        <ButtonV3
          colorClass="bg-gradient-purple rounded-[40px]"
          textColorClass="text-[16px] md:text-[20px] font-bold text-true-black"
          size={isMobile ? ButtonSize.EXTRA_LARGE_LONG_MOBILE : ButtonSize.EXTRA_LARGE_LONG}
          onClick={handleEnterContest}
        >
          enter contest
        </ButtonV3>
      );
    }

    if (anyoneCanSubmit === AnyoneCanSubmit.ONLY_CREATOR) {
      return <p className="text-secondary-11 text-[16px]">only the contest creator can submit entries</p>;
    }

    if (currentUserProposalCount >= contestMaxNumberSubmissionsPerUser) {
      return <p className="text-secondary-11 text-[16px]">you have reached the max submissions this contest allows</p>;
    }

    return null;
  };

  return { renderSubmitButton };
};
