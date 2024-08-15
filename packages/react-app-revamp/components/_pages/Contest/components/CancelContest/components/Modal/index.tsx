import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
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
    <Dialog open={isCloseContestModalOpen} onClose={setIsCloseContestModalOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-neutral-8 bg-opacity-40 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative mb-14 md:mb-0 transform overflow-hidden rounded-t-[40px] border-t border-neutral-9 md:border-none md:rounded-[10px] bg-true-black text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
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
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default CancelContestModal;
