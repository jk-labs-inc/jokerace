/* eslint-disable @next/next/no-img-element */
import { Menu, Transition } from "@headlessui/react";
import { generateLensShareUrl, generateTwitterShareUrl, generateUrlToCopy } from "@helpers/share";
import { DuplicateIcon, ShareIcon } from "@heroicons/react/outline";
import { FC, Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ShareDropdownProps {
  contestAddress: string;
  chain: string;
}

const ShareDropdown: FC<ShareDropdownProps> = ({ contestAddress, chain }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
          <ShareIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-neutral-0 shadow-lg ring-1 ring-inset ring-primary-9 ring-opacity-10 focus:outline-none">
          <div className="text-neutral-11 px-4 py-2 border-b border-neutral-3 text-center">Share contest</div>
          <Menu.Item>
            {({ active }) => (
              <a
                target="_blank"
                href={generateLensShareUrl(contestAddress, chain)}
                className={classNames(
                  active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                  "flex items-center justify-center gap-1 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 border-b border-neutral-3",
                )}
                rel="noreferrer"
              >
                <img src="/socials/lens.svg" alt="Lens" width={24} className="inline-block align-middle" />
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href={generateTwitterShareUrl(contestAddress, chain)}
                target="_blank"
                className={classNames(
                  active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                  "flex items-center justify-center gap-1 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-90 border-b border-neutral-3",
                )}
                rel="noreferrer"
              >
                <img src="/socials/twitter.svg" alt="Lens" width={30} className="inline-block align-middle" />
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                onClick={() => generateUrlToCopy(contestAddress, chain)}
                className={classNames(
                  active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                  "flex items-center justify-center gap-1 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-90 cursor-pointer",
                )}
              >
                <DuplicateIcon className="-mr-1 h-7 w-10 text-gray-400" />
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ShareDropdown;
