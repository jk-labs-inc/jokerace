import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { FC, useCallback } from "react";

interface DialogModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  closeButtonSize?: {
    width: number;
    height: number;
  };
  className?: string;
  isMobile?: boolean;
  disableClose?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
}

const DialogModalV3: FC<DialogModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  children,
  onClose,
  isMobile,
  disableClose,
  className,
  closeButtonSize = { width: 33, height: 33 },
}) => {
  const handleClose = useCallback(() => {
    setIsOpen?.(false);
    if (onClose) {
      onClose();
    }
  }, [setIsOpen, onClose]);

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-neutral-8 bg-opacity-60 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center 2xs:p-4">
        <div className="flex min-h-full w-full items-center justify-center">
          <DialogPanel
            transition
            className={`text-sm mx-auto min-h-screen max-h-screen overflow-y-auto 2xs:min-h-auto 2xs:max-h-[calc(100vh-60px)] w-full px-4 2xs:pt-4 bg-true-black 2xs:rounded-[10px] transform transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in ${className}`}
          >
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <div className="p-0 md:p-2 relative">
              <button
                onClick={handleClose}
                title="Close this"
                className={`${
                  isMobile || disableClose ? "hidden" : "absolute"
                } z-10 top-0 right-[30px] inline-start-0 2xs:inline-start-auto 2xs:inline-end-0 p-4 hover:scale-[1.1] text-neutral-11`}
              >
                <img
                  src="/modal/modal_close.svg"
                  width={closeButtonSize.width}
                  height={closeButtonSize.height}
                  alt="close"
                />
                <span className="sr-only">Close modal</span>
              </button>
              <div className={`${isMobile ? "pt-0" : "pt-3 pb-6"} pie-3`}>{children}</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogModalV3;
