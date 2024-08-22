import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FC } from "react";

interface DialogModalV4Props {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: (value: boolean) => void;
}

const DialogModalV4: FC<DialogModalV4Props> = ({ isOpen, onClose, children }) => {
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-neutral-8 bg-opacity-40 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center text-center lg:items-center p-0">
          <DialogPanel
            transition
            className="relative w-full transform overflow-hidden rounded-t-[40px] border-t border-neutral-9 bg-true-black text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in lg:my-8 lg:w-full lg:max-w-lg lg:rounded-[10px] lg:border-none data-[closed]:lg:translate-y-0 data-[closed]:lg:scale-95"
          >
            <div className={`${isInPwaMode ? "pb-20" : "pb-16"} lg:pb-0 lg:p-6`}>{children}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogModalV4;
