import React, { FC, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { TemplateType } from "../../templates/types";

export interface TemplateOption {
  value: TemplateType;
  label: string;
  disabled?: boolean;
}

interface CreateTemplateDropdownProps {
  options: TemplateOption[];
  className?: string;
  onChange?: (option: TemplateType) => void;
  onMenuStateChange?: (isOpen: boolean) => void;
}

const CreateTemplateDropdown: FC<CreateTemplateDropdownProps> = ({
  options,
  className,
  onChange,
  onMenuStateChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<TemplateOption | null>(null);

  const handleOptionChange = (option: TemplateOption) => {
    setSelectedOption(option);
    onChange?.(option.value);
  };

  return (
    <Menu as="div" className="relative inline-block w-full md:w-[240px]">
      {({ open }) => {
        onMenuStateChange?.(open);

        return (
          <>
            <MenuButton className="flex items-center bg-transparent cursor-pointer w-full pb-2 border-b border-neutral-11">
              <p className={`text-[20px] font-bold ${selectedOption ? "text-neutral-11" : "text-neutral-10"}`}>
                {selectedOption ? selectedOption.label : "Pick a template"}
              </p>
              <ChevronDownIcon
                className={`w-6 cursor-pointer text-neutral-11 ml-auto transition-transform duration-200 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </MenuButton>

            <MenuItems
              className={`
                ${className}
                flex flex-col absolute z-10 w-full top-full mt-4
                bg-true-black border border-neutral-11 rounded-[10px]
                overflow-y-auto max-h-[150px] md:max-h-96 animate-appear
              `}
            >
              {options.map(option => (
                <MenuItem key={option.value}>
                  {({ focus }) => (
                    <button
                      className={`
                        text-neutral-11 text-left py-3 px-4 text-[20px] cursor-pointer
                        ${option.disabled ? "opacity-50 pointer-events-none" : ""}
                        ${focus ? "bg-neutral-3" : ""}
                        ${option.value === selectedOption?.value ? "font-bold" : ""}
                      `}
                      disabled={option.disabled}
                      onClick={() => handleOptionChange(option)}
                    >
                      {option.label}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </>
        );
      }}
    </Menu>
  );
};

export default CreateTemplateDropdown;
