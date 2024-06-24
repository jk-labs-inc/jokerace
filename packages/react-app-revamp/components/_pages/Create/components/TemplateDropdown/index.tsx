import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { FC, Fragment, useState } from "react";
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
    <Menu as="div" className="relative inline-block">
      {({ open }) => {
        onMenuStateChange?.(open);

        return (
          <>
            <Menu.Button className="flex items-center bg-transparent cursor-pointer w-full md:w-[240px] pb-2 border-b border-neutral-11">
              <p className={`text-[20px] font-bold ${selectedOption ? "text-neutral-11" : "text-neutral-10"}`}>
                {selectedOption ? selectedOption.label : "Pick a template"}
              </p>
              <ChevronDownIcon
                className={`w-6 cursor-pointer text-neutral-11 ml-auto transition-transform duration-200 ${
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
                className={`${className} flex flex-col absolute z-10 mt-4 bg-true-black border border-neutral-11 rounded-[10px] overflow-clip animate-appear`}
              >
                {options.map(option => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        className={`text-neutral-11 text-left pt-2 pl-4 pb-2 text-[20px] cursor-pointer
                        ${option.disabled ? "opacity-50 pointer-events-none" : ""}
                        ${active ? "bg-neutral-3" : ""}
                        ${option.value === selectedOption?.value ? "font-bold" : ""}`}
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

export default CreateTemplateDropdown;
