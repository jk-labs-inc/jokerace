import { Menu, Transition } from "@headlessui/react";
import { MediaQuery } from "@helpers/mediaQuery";
import { generateLensShareUrlForContest, generateTwitterShareUrlForContest, generateUrlToCopy } from "@helpers/share";
import { DuplicateIcon } from "@heroicons/react/outline";
import { Reward } from "@hooks/useContest/store";
import Image from "next/image";
import { FC, Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ShareDropdownProps {
  contestName: string;
  contestAddress: string;
  chain: string;
  rewards?: Reward | null;
}

const ShareDropdown: FC<ShareDropdownProps> = ({ contestName, contestAddress, chain, rewards }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MediaQuery maxWidth={768}>
        <Menu.Button className="w-8 h-8 flex items-center rounded-[10px] border border-neutral-11">
          <Image src="/forward.svg" alt="share" className="m-auto" width={15} height={13} />
        </Menu.Button>
      </MediaQuery>
      <MediaQuery minWidth={769}>
        <Menu.Button className="p-4 h-8 flex items-center gap-2 text-neutral-11 text-[16px] font-bold rounded-[10px] border border-neutral-11">
          Share <Image src="/forward.svg" alt="share" className="ml-1" width={20} height={20} />
        </Menu.Button>
      </MediaQuery>

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
                href={generateLensShareUrlForContest(contestName, contestAddress, chain, rewards)}
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
                href={generateTwitterShareUrlForContest(contestName, contestAddress, chain, rewards)}
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
                  width={32}
                  height={32}
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
                <DuplicateIcon className="h-8 w-8 text-gray-400 mr-2" />
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
