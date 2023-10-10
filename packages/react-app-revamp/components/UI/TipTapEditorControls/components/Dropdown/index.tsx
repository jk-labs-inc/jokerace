import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useEditorStore } from "@hooks/useEditor/store";
import { FC, Fragment, useEffect, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface TipTapEditorControlsTextDropdownProps {
  onSelectionChange?: (selectedValue: string) => void;
}

const DEFAULT_SELECTED_TEXT = {
  value: "0",
  label: "Normal text",
};

const TipTapEditorControlsTextDropdown: FC<TipTapEditorControlsTextDropdownProps> = ({ onSelectionChange }) => {
  const [selectedItem, setSelectedItem] = useState(DEFAULT_SELECTED_TEXT);
  const { revertTextOption, setRevertTextOption } = useEditorStore(state => state);

  useEffect(() => {
    if (revertTextOption) {
      setSelectedItem(DEFAULT_SELECTED_TEXT);
      setRevertTextOption(false);
    }
  }, [revertTextOption, setRevertTextOption]);

  const handleSelection = (value: string, label: string) => {
    setSelectedItem({ value, label });
    onSelectionChange?.(value);
  };

  return (
    <Menu as="div" className="relative inline-block mt-[2px] text-left">
      <div>
        <Menu.Button className="inline-flex w-fit items-center justify-center gap-1 rounded-[5px] bg-transparent px-1 py-1 text-[14px] md:text-[16px] text-neutral-11 normal-case">
          {selectedItem.label}
          <ChevronDownIcon className="-mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
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
        <Menu.Items className="absolute left-[5px] md:left-auto right-0 z-10 mt-2 w-52 origin-top-right overflow-x-clip rounded-[5px] bg-white border border-neutral-11 bg-true-black focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() => handleSelection("1", "Heading 1")}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 hover:bg-neutral-3 transition-colors duration-300 ease-in-out normal-case",
                    "text-custom-h1 cursor-pointer",
                  )}
                >
                  Heading 1
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() => handleSelection("2", "Heading 2")}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 hover:bg-neutral-3 transition-colors duration-300 ease-in-out normal-case",
                    "text-custom-h2 cursor-pointer",
                  )}
                >
                  Heading 2
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() => handleSelection("3", "Heading 3")}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 hover:bg-neutral-3 transition-colors duration-300 ease-in-out normal-case",
                    "text-custom-h3 cursor-pointer",
                  )}
                >
                  Heading 3
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() => handleSelection("4", "Heading 4")}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 hover:bg-neutral-3 transition-colors duration-300 ease-in-out normal-case",
                    "text-custom-h4 cursor-pointer",
                  )}
                >
                  Heading 4
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() => handleSelection("0", "Normal text")}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 hover:bg-neutral-3 transition-colors duration-300 ease-in-out normal-case",
                    "text-[16px] cursor-pointer",
                  )}
                >
                  Normal text
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default TipTapEditorControlsTextDropdown;
