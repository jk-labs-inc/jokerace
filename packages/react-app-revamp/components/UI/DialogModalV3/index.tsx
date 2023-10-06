/* eslint-disable react/no-unescaped-entities */
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { FC, useCallback } from "react";

interface DialogModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
  isProposingOnMobile?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
}

const DialogModalV3: FC<DialogModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  children,
  onClose,
  className,
  isProposingOnMobile,
}) => {
  const handleClose = useCallback(() => {
    setIsOpen?.(false);
    if (onClose) {
      onClose();
    }
  }, [setIsOpen, onClose]);

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 pointer-events-none bg-true-black bg-opacity-80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center 2xs:p-4">
        <div className="flex min-h-full w-full items-center justify-center">
          <Dialog.Panel
            className={`text-sm mx-auto min-h-screen max-h-screen overflow-y-auto 2xs:min-h-auto 2xs:max-h-[calc(100vh-60px)] w-full border px-4 pt-4 pb-6 border-neutral-11  bg-true-black 2xs:rounded-lg ${className}`}
          >
            <Dialog.Title className="sr-only">{title}</Dialog.Title>
            <div className="p-2 relative">
              <button
                onClick={handleClose}
                title="Close this"
                className={`${
                  isProposingOnMobile ? "hidden" : "flex"
                }  absolute z-10 top-0 right-[30px] inline-start-0 2xs:inline-start-auto 2xs:inline-end-0 p-4 hover:scale-[1.1] text-neutral-11`}
              >
                <Image src="/modal/modal_close.svg" width={39} height={33} alt="close" />
                <span className="sr-only">Close modal</span>
              </button>
              {isProposingOnMobile && (
                <button
                  onClick={handleClose}
                  title="Close this"
                  className="flex md:hidden absolute z-10 text-[16px] text-left font-bold top-0 right-0 inline-start-0 2xs:inline-start-auto 2xs:inline-end-0 p-4 hover:scale-[1.1] text-neutral-11"
                >
                  <p>cancel</p>
                </button>
              )}

              <div className="pt-20 2xs:pt-3 pie-3">{children}</div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogModalV3;
