import { FC, Fragment, useState, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const options = [
  { value: "random", label: "Random" },
  { value: "mostRecent", label: "Most Recent" },
  { value: "leastRecent", label: "Least Recent" },
  { value: "votes", label: "Votes" },
];

interface SortProposalsDropdownProps {
  defaultValue: string;
  onChange?: (value: string) => void;
  onMenuStateChange?: (isOpen: boolean) => void;
}

const SortProposalsDropdown: FC<SortProposalsDropdownProps> = ({ defaultValue, onChange, onMenuStateChange }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  const selectedLabel = options.find(option => option.value === selectedValue)?.label || defaultValue;

  return (
    <Menu as="div" className="relative inline-block text-left" ref={menuRef}>
      {({ open }) => {
        onMenuStateChange?.(open);

        return (
          <>
            <Menu.Button className="flex items-center gap-2 text-[16px] text-positive-11 w-full">
              sort: {selectedLabel}
              <ChevronDownIcon className="w-6 h-6 text-positive-11" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute overflow-x-clip md:-right-2 z-10 mt-4 w-36 rounded-[10px] shadow-sortProposalDropdown focus:outline-none">
                {options.map(option => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        type="button"
                        className={classNames(
                          active ? "bg-neutral-2" : "bg-true-black",
                          "block w-full px-4 py-2 text-left text-[16px]",
                          option.value === selectedValue ? "font-bold" : "",
                        )}
                        onClick={() => handleSelectionChange(option.value)}
                      >
                        {option.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </>
        );
      }}
    </Menu>
  );
};

export default SortProposalsDropdown;
