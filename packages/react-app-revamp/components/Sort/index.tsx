import { Menu, Transition } from "@headlessui/react";
import {
  ArrowCircleDownIcon,
  ArrowDownIcon,
  ArrowSmDownIcon,
  ArrowSmUpIcon,
  ChevronDownIcon,
  DuplicateIcon,
} from "@heroicons/react/outline";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Sort = () => {
  return (
    <Menu as="div" className="relative inline-block text-left text-[16px]">
      <div className="bg-true-black rounded-xl border border-neutral-9 h-10 pl-10 pr-10">
        <Menu.Button className="flex items-center">
          Sort <ChevronDownIcon className="w-5" />{" "}
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
          <Menu.Item>
            {({ active }) => (
              <a
                target="_blank"
                className={classNames(
                  active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                  "flex items-center gap-1 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 border-b border-neutral-3",
                )}
                rel="noreferrer"
              >
                <img src="/socials/lens.svg" alt="Lens" width={24} height={24} className="object-fit-cover mr-2" />
                <span className="text-left">share on Lens</span>
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                target="_blank"
                className={classNames(
                  active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                  "flex items-center gap-1 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 border-b border-neutral-3",
                )}
                rel="noreferrer"
              >
                <img
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
                className={classNames(
                  active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                  "flex items-center gap-1 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 cursor-pointer",
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

export default Sort;
