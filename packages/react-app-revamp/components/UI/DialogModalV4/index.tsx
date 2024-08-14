import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FC } from "react";

interface DialogModalV4Props {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: (value: boolean) => void;
}

const DialogModalV4: FC<DialogModalV4Props> = ({ isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
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
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogModalV4;
