import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, useRef, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export interface SortOption {
  property: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  defaultValue: string;
  onChange?: (value: string) => void;
}

const SortDropdown: FC<SortDropdownProps> = ({ options, defaultValue, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  const selectedLabel = options.find(option => option.property === selectedValue)?.label || defaultValue;

  return (
    <Menu as="div" className="relative inline-block text-left" ref={menuRef}>
      <MenuButton className="flex items-center gap-2 text-[12px] md:text-[16px] text-positive-11 w-full">
        sort: {selectedLabel}
        <ChevronDownIcon className="w-6 h-6 text-positive-11" aria-hidden="true" />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute overflow-x-auto md:-right-2 z-10 mt-4 w-36 rounded-md shadow-sort-proposal-dropdown focus:outline-none">
          {options.map(option => (
            <MenuItem key={option.property}>
              {({ focus }) => (
                <button
                  type="button"
                  className={classNames(
                    focus ? "bg-neutral-2" : "bg-true-black",
                    "block w-full px-4 py-2 text-left text-[16px]",
                    option.property === selectedValue ? "font-bold" : "",
                  )}
                  onClick={() => handleSelectionChange(option.property)}
                >
                  {option.label}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default SortDropdown;
