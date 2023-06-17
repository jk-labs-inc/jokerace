/* eslint-disable react/no-unescaped-entities */
import { Dialog } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { FC, useCallback, useState } from "react";
import ButtonV3 from "../ButtonV3";

interface DialogModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  children: React.ReactNode;
  disableClose?: boolean;
  onClose?: () => void;
  className?: string;
  doubleCheckClose?: boolean;
  doubleCheckMessage?: string;
}

const DialogModalV3: FC<DialogModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  children,
  onClose,
  className,
  disableClose,
  doubleCheckClose = false,
  doubleCheckMessage,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClose = useCallback(() => {
    if (doubleCheckClose && !showConfirmation) {
      setShowConfirmation(true);
    } else {
      if (disableClose) {
        return;
      }

      setIsOpen(false);
      if (onClose) {
        onClose();
      }
      setShowConfirmation(false);
    }
  }, [setIsOpen, onClose, doubleCheckClose, showConfirmation, disableClose]);

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 pointer-events-none bg-true-black bg-opacity-80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center 2xs:p-4">
        <div className="flex min-h-full w-full items-center justify-center">
          <Dialog.Panel
            className={`text-sm mx-auto min-h-screen max-h-screen overflow-y-auto 2xs:min-h-auto 2xs:max-h-[calc(100vh-60px)] w-full  border px-4 pt-4 pb-6 border-neutral-11  bg-true-black 2xs:rounded-lg ${className}`}
          >
            <Dialog.Title className="sr-only">{title}</Dialog.Title>
            <div className="p-2 relative">
              <button
                onClick={handleClose}
                title="Close this"
                className="absolute z-10 top-0 inline-start-0 2xs:inline-start-auto 2xs:inline-end-0 p-4 hover:scale-[1.1] text-neutral-11"
              >
                <Image src="/modal/modal_close.svg" width={39} height={33} alt="close" />
                <span className="sr-only">Close modal</span>
              </button>
              {showConfirmation && (
                <div className="w-full h-full flex gap-4 items-start justify-start bg-white bg-opacity-80 pl-[100px] animate-swingInLeft">
                  <div className="flex flex-col gap-2 p-4 bg-white rounded shadow">
                    <p className="text-neutral-11">Are you sure you want to close?</p>
                    <p className="text-neutral-11">{doubleCheckMessage}</p>
                    <div className="flex gap-4">
                      <ButtonV3
                        onClick={() => {
                          setShowConfirmation(false);
                          setIsOpen(true);
                        }}
                        color="bg-primary-10"
                      >
                        Cancel
                      </ButtonV3>
                      <ButtonV3 onClick={handleClose} color="bg-negative-11">
                        close
                      </ButtonV3>
                    </div>
                  </div>
                </div>
              )}
              <div className={`pt-20 2xs:pt-3 pie-3 ${showConfirmation ? "opacity-20" : "opacity-100"}`}>
                {children}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogModalV3;
