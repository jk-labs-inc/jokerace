import { Option } from "@components/_pages/Create/components/DefaultDropdown";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, useEffect, useState } from "react";

interface CreateRewardsPoolRecipientsDropdownProps {
  options: Option[];
  defaultOption: Option;
  className?: string;
  onChange?: (option: string) => void;
  onMenuStateChange?: (isOpen: boolean) => void;
}

const CreateRewardsPoolRecipientsDropdown: FC<CreateRewardsPoolRecipientsDropdownProps> = ({
  options,
  defaultOption,
  className,
  onChange,
  onMenuStateChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option>(defaultOption);

  useEffect(() => {
    setSelectedOption(defaultOption);
  }, [defaultOption]);

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
            <MenuButton className="flex items-center justify-center bg-neutral-14 cursor-pointer w-20 h-8 rounded-[8px] px-2 py-2 relative">
              <div className="flex items-center justify-center absolute inset-0 pr-6">
                <p className="text-[16px] text-true-black font-bold">
                  {selectedOption.label}{" "}
                  <sup className="text-primary-5 font-bold">{returnOnlySuffix(parseFloat(selectedOption.label))}</sup>
                </p>
              </div>
              <ChevronDownIcon
                className={`w-6 cursor-pointer text-primary-5 absolute right-2 transition-transform duration-200 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
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
              <MenuItems
                className={` ${className} flex flex-col absolute w-20 z-10 mt-4 bg-true-black border border-neutral-11 rounded-[10px] overflow-hidden animate-appear max-h-40 md:max-h-56 overflow-y-auto`}
              >
                {options.map(option => (
                  <MenuItem key={option.value}>
                    {({ focus }) => (
                      <button
                        className={`text-neutral-10 text-left pt-2 pl-4 pb-2 text-[16px] cursor-pointer w-full ${option.disabled ? "opacity-50 pointer-events-none" : ""} ${focus ? "bg-neutral-3" : ""}
            ${option.value === selectedOption.value ? "text-neutral-11 font-bold" : ""} hover:bg-neutral-3 transition-colors duration-150
          `}
                        disabled={option.disabled}
                        onClick={() => handleOptionChange(option)}
                      >
                        {option.label} <sup>{returnOnlySuffix(parseFloat(option.label))}</sup>
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </>
        );
      }}
    </Menu>
  );
};

export default CreateRewardsPoolRecipientsDropdown;
