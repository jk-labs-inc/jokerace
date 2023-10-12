import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import Image from "next/image";
import { FC } from "react";

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
  const title = isLoading ? "approving transaction..." : isSuccess ? "your submission is live!" : "confirm submission";

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 left-0 right-0 bottom-0 bg-true-black w-full border-t border-neutral-9 rounded-t-[40px] animate-appear px-10 py-8 ">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-[24px] font-bold">{title}</p>
          <Image src="/modal/modal_close.svg" width={24} height={24} alt="close" onClick={onClose} />
        </div>
        <div className="flex gap-8 text-neutral-9 text-[16px]">
          <p className="uppercase font-bold">entry charge</p>
          <p className="uppercase">GAS</p>
        </div>
      </div>
    </div>
  );
};

export default DialogModalSendProposalMobileLayoutConfirm;
