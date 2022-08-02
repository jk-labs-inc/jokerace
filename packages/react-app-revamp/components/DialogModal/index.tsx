import { IconClose } from "@components/Icons";
import { Dialog } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/outline";

export interface DialogModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export const DialogModal = (props: DialogModalProps) => {
  const { isOpen, setIsOpen, title, children } = props;
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-true-black bg-opacity-50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center 2xs:p-4">
        {/* Container to center the panel */}
        <div className="flex min-h-full w-full items-center justify-center">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="text-sm mx-auto min-h-screen  max-h-screen overflow-y-auto 2xs:min-h-auto 2xs:max-h-[calc(100vh-60px)] w-full max-w-screen-2xs border px-4 pt-4 pb-6 border-neutral-4 bg-neutral-0 2xs:rounded-lg">
            <Dialog.Title className="sr-only">{title}</Dialog.Title>
            <div className="p-2 relative">
              <button
                onClick={() => setIsOpen(false)}
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
              <div className="pt-20 2xs:pt-3 pie-3">{children}</div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogModal;
