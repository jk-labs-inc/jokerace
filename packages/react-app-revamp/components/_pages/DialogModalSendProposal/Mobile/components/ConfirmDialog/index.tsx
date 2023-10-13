import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import Image from "next/image";
import { FC, useEffect } from "react";
import SendProposalMobileLayoutConfirmInitialContent from "./components/InitialContent";
import SendProposalMobileLayoutConfirmLoadingContent from "./components/LoadingContent";
import SendProposalMobileLayoutConfirmSuccessContent from "./components/SuccessContent";

interface DialogModalSendProposalMobileLayoutConfirmProps {
  isOpen?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}

const DialogModalSendProposalMobileLayoutConfirm: FC<DialogModalSendProposalMobileLayoutConfirmProps> = ({
  isOpen,
  onConfirm,
  onClose,
}) => {
  const { isLoading, isSuccess, proposalId } = useSubmitProposalStore(state => state);
  const title = isLoading
    ? "approving transaction..."
    : isSuccess && proposalId
    ? "your submission is live!"
    : "confirm submission";

  if (!isOpen) return null;

  const renderContent = () => {
    if (isLoading) return <SendProposalMobileLayoutConfirmLoadingContent />;
    if (isSuccess && proposalId) return <SendProposalMobileLayoutConfirmSuccessContent proposalId={proposalId} />;
    return <SendProposalMobileLayoutConfirmInitialContent onConfirm={onConfirm} />;
  };

  return (
    <div className="fixed z-50 left-0 right-0 bottom-0 bg-true-black w-full border-t border-neutral-9 rounded-t-[40px] animate-appear px-10 py-8 ">
      <div className={`flex flex-col ${isSuccess ? "gap-8" : "gap-8"}`}>
        <div className="flex justify-between items-center">
          <p className="text-[24px] font-bold">{title}</p>
          <Image src="/modal/modal_close.svg" width={24} height={24} alt="close" onClick={onClose} />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DialogModalSendProposalMobileLayoutConfirm;
