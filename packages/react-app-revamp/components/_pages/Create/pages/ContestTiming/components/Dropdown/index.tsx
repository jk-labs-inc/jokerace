import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FC, useEffect, useState } from "react";

export interface CreateContestTimingDropdownOption {
  label: string;
  value: string;
}

interface CreateContestTimingDropdownProps {
  options: CreateContestTimingDropdownOption[];
  defaultValue: string;
  width?: string;
  onChange?: (option: string) => void;
}

const CreateContestTimingDropdown: FC<CreateContestTimingDropdownProps> = ({
  options,
  defaultValue,
  width = "w-52",
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue);

  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  const handleOptionChange = (value: string, label: string) => {
    setSelectedOption(label);
    onChange?.(value);
  };

  return (
    <Menu>
      <MenuButton
        className={`${width} flex items-center justify-between rounded-lg bg-secondary-1 p-4 h-10 text-[20px] text-neutral-11 font-bold border border-neutral-17 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:border-neutral-9 transition-all duration-200 ease-in-out`}
      >
        {selectedOption}
        <ChevronDownIcon className="text-neutral-11 w-6 h-5 mt-1" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className={`${width} origin-top-right max-h-60! rounded-lg border border-neutral-17 bg-secondary-1 p-1 text-[16px] text-neutral-11 transition duration-100 ease-out [--anchor-gap:--spacing(2)] focus:outline-none data-closed:scale-95 data-closed:opacity-0`}
      >
        {options.map(option => (
          <MenuItem key={option.value}>
            <button
              className="group flex w-full items-center gap-2 rounded-lg px-4 py-1.5 data-focus:bg-white/10"
              onClick={() => handleOptionChange(option.value, option.label)}
            >
              {option.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default CreateContestTimingDropdown;
