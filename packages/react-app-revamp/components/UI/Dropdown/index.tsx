import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface DropdownProps {
  menuItems: { value: string; label: string }[];
  onSelectionChange?: (selectedValue: string) => void;
}

const Dropdown: FC<DropdownProps> = ({ menuItems, onSelectionChange }) => {
  const [selectedValue, setSelectedValue] = useState(menuItems[0]?.value || "");

  const handleSelection = (value: string) => {
    setSelectedValue(value);
    onSelectionChange?.(value);
  };
  return (
    <Menu as="div" className="relative inline-block text-left w-[100px]">
      <div>
        <MenuButton className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-[5px] border border-neutral-11 bg-transparent px-1 py-1 text-[14px] sm:text-[16px] font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {selectedValue}
          <ChevronDownIcon className="-mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
        </MenuButton>
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
        <MenuItems className="absolute right-0 z-10 mt-5 w-40 overflow-x-clip rounded-[5px] bg-white border border-neutral-11 bg-true-black focus:outline-none">
          <div className="py-1">
            {menuItems.map(item => (
              <MenuItem key={item.value}>
                {({ focus }) => (
                  <a
                    href="#"
                    onClick={() => handleSelection(item.value)}
                    className={classNames(
                      focus ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-[14px] sm:text-[16px] hover:bg-neutral-3 transition-colors duration-300 ease-in-out ",
                    )}
                  >
                    {item.label}
                  </a>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
