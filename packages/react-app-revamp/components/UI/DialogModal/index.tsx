import { IconClose } from "@components/UI/Icons";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { FC, useCallback } from "react";

interface DialogModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DialogModal: FC<DialogModalProps> = ({ isOpen, setIsOpen, title, children, className }) => {
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 pointer-events-none bg-true-black bg-opacity-80" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center 2xs:p-4">
        <div className="flex min-h-full w-full items-center justify-center">
          <DialogPanel
            className={`text-sm mx-auto max-h-screen overflow-y-auto 2xs:min-h-auto 2xs:max-h-[calc(100vh-60px)] w-full max-w-screen-2xs border px-4 pt-4 pb-6 border-primary-10 border-opacity-40 bg-neutral-0 2xs:rounded-lg ${className}`}
          >
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <div className="p-2 relative">
              <button
                onClick={handleClose}
                title="Close this"
                className="absolute z-10 top-0 inline-start-0 2xs:inline-start-auto 2xs:inline-end-0 p-2 hover:scale-[1.1] text-neutral-11"
              >
                <span className="flex items-center 2xs:hidden">
                  <ArrowLeftIcon aria-hidden="true" className="w-6" />
                  <span aria-hidden="true" className="px-1ex text-3xs">
                    Back
                  </span>
                </span>
                <IconClose className="hidden 2xs:block" />
                <span className="sr-only">Close modal</span>
              </button>
              <div className="pt-20 2xs:pt-3 pie-2">{children}</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogModal;
