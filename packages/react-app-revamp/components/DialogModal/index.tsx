import { Dialog } from "@headlessui/react";

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

      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Container to center the panel */}
        <div className="flex min-h-full w-full items-center justify-center">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="text-sm mx-auto w-full max-w-screen-2xs border px-4 pt-4 pb-6 border-neutral-4 bg-neutral-0 rounded-lg">
            <Dialog.Title className="sr-only">{title}</Dialog.Title>
            <div className="p-2 relative">
              <button
                onClick={() => setIsOpen(false)}
                title="Close this"
                className="absolute z-10 top-0 inline-end-0 p-2 hover:scale-[1.1] text-neutral-11"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="10"
                  viewBox="0 0 10 10"
                  width="10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              {children}
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogModal;
