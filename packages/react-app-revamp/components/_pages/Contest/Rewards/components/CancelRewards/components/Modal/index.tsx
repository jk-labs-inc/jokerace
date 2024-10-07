import DialogModalV4 from "@components/UI/DialogModalV4";
import { FC } from "react";

interface CancelRewardsModalProps {
  isCancelRewardsModalOpen: boolean;
  setIsCancelRewardsModalOpen: (isOpen: boolean) => void;
  cancelRewardsHandler: () => void;
}

const CancelRewardsModal: FC<CancelRewardsModalProps> = ({
  isCancelRewardsModalOpen,
  setIsCancelRewardsModalOpen,
  cancelRewardsHandler,
}) => {
  return (
    <DialogModalV4 isOpen={isCancelRewardsModalOpen} onClose={setIsCancelRewardsModalOpen}>
      <div className="flex flex-col gap-8 py-6 md:py-16 pl-8 md:pl-32 pr-4 md:pr-16">
        <div className="flex justify-between items-center">
          <p className="text-[24px] text-neutral-11 font-bold">cancel rewards?? 😬</p>
          <img
            src="/modal/modal_close.svg"
            width={39}
            height={33}
            alt="close"
            className="hidden md:block cursor-pointer"
            onClick={() => setIsCancelRewardsModalOpen(false)}
          />
        </div>
        <div className="flex flex-col gap-4 text-neutral-11 text-[16px]">
          <p>if you proceed, you will cancel rewards for this contest.</p>
          <p className="font-bold">🚨 players will not be able to receive rewards.</p>
          <p>🚨 after you cancel rewards, you can withdraw any funds on the rewards page.</p>
          <p>🚨 you will not be able to deploy another rewards pool for this contest.</p>
          <p>are you really, really, really sure you want to proceed?</p>
        </div>
        <button
          className="mt-4 bg-negative-11 rounded-[40px] w-80 h-10 text-center text-true-black text-[16px] font-bold hover:opacity-80 transition-opacity duration-300 ease-in-out"
          onClick={cancelRewardsHandler}
        >
          cancel rewards 😈
        </button>
      </div>
    </DialogModalV4>
  );
};

export default CancelRewardsModal;
