import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { MenuIcon } from "@heroicons/react/outline";
import Image from "next/image";

type BurgerMenuProps = {
  children: React.ReactNode;
  className?: string;
};

const BurgerMenu = ({ children, className }: BurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialFocusRef = useRef(null);

  return (
    <>
      <MenuIcon className="h-8 w-8" onClick={() => setIsOpen(true)} aria-label="Open menu" />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden"
          onClose={() => setIsOpen(false)}
          initialFocus={initialFocusRef}
        >
          <div tabIndex={-1} ref={initialFocusRef} />
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto fixed inset-y-0 right-0 flex max-w-full pl-10 z-50 bg-true-black">
                <Dialog.Panel
                  className={`w-screen max-w-md transform transition ease-in-out duration-300 ${className}`}
                >
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="mt-24 relative flex-1">{children}</div>
                    <div className="absolute top-2 right-0 pt-4 pr-6">
                      <button type="button" onClick={() => setIsOpen(false)}>
                        <span className="sr-only">Close</span>
                        <Image src="/modal/modal_close.svg" width={32} height={32} alt="close" />
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default BurgerMenu;
