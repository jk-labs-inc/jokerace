import { ChevronDownIcon } from "@heroicons/react/outline";
import { FC, useEffect, useRef, useState } from "react";

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
  onMenuStateChange?: (state: boolean) => void;
}

const CreateDefaultDropdown: FC<CreateDefaultDropdownProps> = ({
  options,
  defaultOption,
  className,
  onChange,
  onMenuStateChange,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(defaultOption);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onMenuStateChange?.(showOptions);
  }, [showOptions, onMenuStateChange]);

  useEffect(() => {
    setSelectedOption(defaultOption);
  }, [defaultOption]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    const selectedOption = options.find(option => option.value === optionValue);
    if (selectedOption) {
      setShowOptions(false);
      setSelectedOption(selectedOption);
      onChange?.(selectedOption.value);
    }
  };
  const handleDropdownMenu = () => {
    setShowOptions(true);
  };

  return (
    <div className="flex relative" ref={wrapperRef}>
      <div
        className="flex items-center bg-neutral-14 cursor-pointer w-[216px] h-10 rounded-[5px] px-4 py-2"
        onClick={handleDropdownMenu}
      >
        <p className="text-[20px] text-true-black">{selectedOption.label}</p>
        <ChevronDownIcon className="w-6 cursor-pointer text-true-black ml-auto" />
      </div>

      {showOptions && (
        <ul
          className={`flex flex-col gap-4 pt-4 pl-4 pb-4 absolute z-10 mt-16 list-none bg-true-black border border-neutral-11 rounded-[10px] overflow-x-clip animate-appear ${className}`}
        >
          {options.map(option => (
            <li
              //TODO: check padding here
              className={`text-neutral-11 text-[18px] cursor-pointer 
        ${
          option.disabled
            ? "opacity-50 pointer-events-none"
            : "hover:bg-neutral-3 transition-colors duration-300 ease-in-out"
        }
        ${selectedOption?.value === option.value ? "font-bold" : ""}`}
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateDefaultDropdown;
