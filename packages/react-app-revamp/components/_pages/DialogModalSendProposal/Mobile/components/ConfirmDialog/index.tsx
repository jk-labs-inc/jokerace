import DialogModalSendProposalSuccessLayout from "@components/_pages/DialogModalSendProposal/components/SuccessLayout";
import { Charge } from "@hooks/useDeployContest/types";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { type GetBalanceReturnType } from "@wagmi/core";
import { FC, useState } from "react";
import SendProposalMobileLayoutConfirmInitialContent from "./components/InitialContent";
import SendProposalMobileLayoutConfirmLoadingContent from "./components/LoadingContent";

interface DialogModalSendProposalMobileLayoutConfirmProps {
  chainName: string;
  contestId: string;
  isOpen?: boolean;
  charge: Charge;
  accountData: GetBalanceReturnType | undefined;
  onConfirm?: () => void;
  onClose?: () => void;
}

const DialogModalSendProposalMobileLayoutConfirm: FC<DialogModalSendProposalMobileLayoutConfirmProps> = ({
  chainName,
  contestId,
  isOpen,
  charge,
  accountData,
  onConfirm,
  onClose,
}) => {
  const { isLoading, isSuccess, proposalId } = useSubmitProposalStore(state => state);
  const [showOnramp, setShowOnramp] = useState(false);
  const title = isLoading
    ? "approving transaction..."
    : isSuccess && proposalId
    ? "your entry is live!"
    : "submit entry";

  if (!isOpen) return null;

  const renderContent = () => {
    if (isLoading) return <SendProposalMobileLayoutConfirmLoadingContent />;
    if (isSuccess && proposalId)
      return (
        <DialogModalSendProposalSuccessLayout proposalId={proposalId} chainName={chainName} contestId={contestId} />
      );
    return (
      <SendProposalMobileLayoutConfirmInitialContent
        onConfirm={onConfirm}
        charge={charge}
        accountData={accountData}
        chainName={chainName}
        onShowOnramp={setShowOnramp}
      />
    );
  };

  return (
    <div className="fixed z-50 left-0 right-0 bottom-0 bg-true-black w-full border-t border-neutral-9 rounded-t-[40px] animate-appear pl-10 pr-8 pt-8 pb-4">
      <div className={`flex flex-col ${isSuccess ? "gap-8" : "gap-5"} transition-all`}>
        <div className="flex justify-between items-center">
          {!showOnramp ? <p className="text-[24px] font-bold">{title}</p> : null}
          {!showOnramp ? (
            <img src="/modal/modal_close.svg" width={24} height={24} alt="close" onClick={onClose} />
          ) : null}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DialogModalSendProposalMobileLayoutConfirm;
