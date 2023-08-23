import { Menu, Transition } from "@headlessui/react";
import { generateLensShareUrl, generateTwitterShareUrl, generateUrlToCopy } from "@helpers/share";
import { DuplicateIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { FC, Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ShareDropdownProps {
  contestName: string;
  contestAddress: string;
  chain: string;
}

const ShareDropdown: FC<ShareDropdownProps> = ({ contestName, contestAddress, chain }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="p-4 h-8 flex items-center gap-2 text-neutral-11 text-[16px] font-bold rounded-[10px] border border-neutral-11">
          Share <Image src="/forward.png" alt="share" className="ml-1 w-4" width={20} height={20} />
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
        <Menu.Items className="absolute right-0 z-10  mt-2 w-48 origin-top-right rounded-md bg-true-black shadow-lg ring-1 ring-inset ring-primary-9 ring-opacity-10 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <a
                target="_blank"
                href={generateLensShareUrl(contestName, contestAddress, chain)}
                className={classNames(
                  active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                  "flex items-center text-[16px] gap-1 px-4 py-2 hover:bg-gray-100 hover:text-gray-900 border-b border-neutral-3",
                )}
                rel="noreferrer"
              >
                <Image src="/socials/lens.svg" alt="Lens" width={32} height={32} className="object-fit-cover mr-2" />
                <span className="text-left">share on Lens</span>
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href={generateTwitterShareUrl(contestName, contestAddress, chain)}
                target="_blank"
                className={classNames(
                  active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                  "flex items-center text-[16px] gap-1 px-4 py-2  hover:bg-gray-100 hover:text-gray-900 border-b border-neutral-3",
                )}
                rel="noreferrer"
              >
                <Image
                  src="/socials/twitter.svg"
                  alt="Twitter"
                  width={24}
                  height={24}
                  className="object-fit-cover mr-2"
                />
                <span className="text-left">share on Twitter</span>
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                onClick={() => generateUrlToCopy(contestAddress, chain)}
                className={classNames(
                  active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                  "flex items-center gap-1 px-4 py-2 text-[16px] hover:bg-gray-100 hover:text-gray-900 cursor-pointer",
                )}
              >
                <DuplicateIcon className="h-6 w-6 text-gray-400 mr-2" />
                <span className="text-left">copy link</span>
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ShareDropdown;
