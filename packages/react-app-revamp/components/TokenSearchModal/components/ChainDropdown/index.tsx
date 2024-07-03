import { FC, Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { chainsImages } from "@config/wagmi";

export interface Option {
  value: string;
  label: string;
}

interface ChainDropdownProps {
  options: Option[];
  defaultOption: Option;
  className?: string;
  onChange?: (option: string) => void;
  onMenuStateChange?: (isOpen: boolean) => void;
}

const TokenSearchModalChainDropdown: FC<ChainDropdownProps> = ({
  options,
  defaultOption,
  className,
  onChange,
  onMenuStateChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option>(defaultOption);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onChange?.(option.value);
  };

  if (options.length === 1) {
    return (
      <div className="flex gap-2 items-center">
        <Image src="/mainnet.svg" alt="ethereum" width={20} height={20} />
        <p className="text-[16px] text-neutral-11 font-bold uppercase">ethereum</p>
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => {
        onMenuStateChange?.(open);

        return (
          <>
            <Menu.Button className="flex items-center bg-primary-5 cursor-pointer border border-neutral-10 w-full md:w-[200px] h-full md:h-12 rounded-[15px] px-4 py-2">
              <div className="flex gap-2 items-center">
                <Image src={chainsImages[selectedOption.value]} width={24} height={24} alt="chain logo" />
                <p className="text-[20px] text-neutral-11 font-bold">{selectedOption.label}</p>
              </div>
              <ChevronDownIcon
                className={`w-6 text-neutral-11 ml-auto transition-transform duration-200 ${
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
                className={`flex flex-col w-full md:w-[200px] absolute z-10 mt-4 list-none bg-primary-5 border border-neutral-10 rounded-[10px] overflow-x-clip animate-appear ${className}`}
              >
                {options.map(option => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        className={`text-neutral-11 pt-2 pl-4 pb-2 text-[16px] cursor-pointer 
                      ${active ? "bg-neutral-3" : ""}
                      ${option.value === selectedOption.value ? "font-bold" : ""}`}
                        onClick={() => handleOptionClick(option)}
                      >
                        <div className="flex gap-2 items-center">
                          <Image src={chainsImages[option.value]} width={24} height={24} alt="chain logo" />
                          {option.label}
                        </div>
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

export default TokenSearchModalChainDropdown;
