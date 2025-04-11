import DialogModalV4 from "@components/UI/DialogModalV4";
import { FC } from "react";

interface SubmissionDeleteModalProps {
  isDeleteProposalModalOpen: boolean;
  setIsDeleteProposalModalOpen: (isOpen: boolean) => void;
  onClick?: () => void;
}

const SubmissionDeleteModal: FC<SubmissionDeleteModalProps> = ({
  isDeleteProposalModalOpen,
  setIsDeleteProposalModalOpen,
  onClick,
}) => {
  return (
    <DialogModalV4 isOpen={isDeleteProposalModalOpen} onClose={setIsDeleteProposalModalOpen}>
      <div className="flex flex-col gap-8 py-6 md:py-16 pl-8 md:pl-32 pr-4 md:pr-16">
        <div className="flex justify-between items-center">
          <p className="text-[24px] text-neutral-11 font-bold">delete entry?? 😬</p>
          <img
            src="/modal/modal_close.svg"
            width={24}
            height={24}
            alt="close"
            className="hidden md:block cursor-pointer"
            onClick={() => setIsDeleteProposalModalOpen(false)}
          />
        </div>
        <div className="flex flex-col gap-4 text-neutral-11 text-[16px]">
          <p>if you proceed, you will delete this entry.</p>
          <p>🚨 it will no longer be featured on the site.</p>
          <p>🚨 nobody will be able to comment or vote on it.</p>
          <p>🚨 it will still exist on the blockchain.</p>
          <p className="hidden md:block">are you really, really, really sure you want to proceed?</p>
          <p className="md:hidden">are you really, really sure you want to proceed?</p>
        </div>
        <button
          className="mt-4 bg-negative-11 rounded-[40px] w-80 h-10 text-center text-true-black text-[16px] font-bold md:hover:opacity-80 transition-opacity duration-300 ease-in-out"
          onClick={onClick}
        >
          delete entry 😈
        </button>
      </div>
    </DialogModalV4>
  );
};

export default SubmissionDeleteModal;
