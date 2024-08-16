import DialogModalV4 from "@components/UI/DialogModalV4";
import Image from "next/image";
import { FC } from "react";

interface CancelContestModalProps {
  isCloseContestModalOpen: boolean;
  setIsCloseContestModalOpen: (isOpen: boolean) => void;
  cancelContestHandler: () => void;
}

const CancelContestModal: FC<CancelContestModalProps> = ({
  isCloseContestModalOpen,
  setIsCloseContestModalOpen,
  cancelContestHandler,
}) => {
  return (
    <DialogModalV4 isOpen={isCloseContestModalOpen} onClose={setIsCloseContestModalOpen}>
      <div className="flex flex-col gap-8 py-6 md:py-16 pl-8 md:pl-32 pr-4 md:pr-16">
        <div className="flex justify-between items-center">
          <p className="text-[24px] text-neutral-11 font-bold">cancel contest?? 😬</p>
          <Image
            src="/modal/modal_close.svg"
            width={39}
            height={33}
            alt="close"
            className="hidden md:block cursor-pointer"
            onClick={() => setIsCloseContestModalOpen(false)}
          />
        </div>
        <div className="flex flex-col gap-4 text-neutral-11 text-[16px]">
          <p>if you proceed, you will cancel this contest.</p>
          <p className="font-bold">🚨 players will not be able to keep playing.</p>
          <p>
            🚨 the contest and entries <i>will</i> remain visible on our site.
          </p>
          <p>🚨 you can withdraw any funds on the rewards page.</p>
          <p>are you really, really, really sure you want to proceed?</p>
        </div>
        <button
          className="mt-4 bg-negative-11 rounded-[40px] w-80 h-10 text-center text-true-black text-[16px] font-bold hover:opacity-80 transition-opacity duration-300 ease-in-out"
          onClick={cancelContestHandler}
        >
          cancel contest 😈
        </button>
      </div>
    </DialogModalV4>
  );
};

export default CancelContestModal;
