import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { FC, Fragment, useState } from "react";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CreateDefaultDropdownProps {
  options: Option[];
  defaultOption: Option;
  className?: string;
  onChange?: (option: string) => void;
  onMenuStateChange?: (isOpen: boolean) => void;
}

const CreateDefaultDropdown: FC<CreateDefaultDropdownProps> = ({
  options,
  defaultOption,
  className,
  onChange,
  onMenuStateChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option>(defaultOption);

  const handleOptionChange = (option: Option) => {
    setSelectedOption(option);
    onChange?.(option.value);
  };

  return (
    <Menu as="div" className="relative inline-block">
      {({ open }) => {
        onMenuStateChange?.(open);

        return (
          <>
            <Menu.Button className="flex items-center bg-neutral-14 cursor-pointer w-[216px] h-10 rounded-[5px] px-4 py-2">
              <p className="text-[20px] text-true-black">{selectedOption.label}</p>
              <ChevronDownIcon
                className={`w-6 cursor-pointer text-true-black ml-auto transition-transform duration-200 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
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
              <Menu.Items
                className={`flex flex-col absolute z-10 mt-4 bg-true-black border border-neutral-11 rounded-[10px] overflow-clip animate-appear ${className}`}
              >
                {options.map(option => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        className={`text-neutral-11 text-left pt-2 pl-4 pb-2 text-[16px] cursor-pointer
                        ${option.disabled ? "opacity-50 pointer-events-none" : ""}
                        ${active ? "bg-neutral-3" : ""}
                        ${option.value === selectedOption.value ? "font-bold" : ""}`}
                        disabled={option.disabled}
                        onClick={() => handleOptionChange(option)}
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

export default CreateDefaultDropdown;
