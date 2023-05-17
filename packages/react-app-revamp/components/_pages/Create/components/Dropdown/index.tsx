import { ChevronDownIcon } from "@heroicons/react/outline";
import { FC, useEffect, useRef, useState } from "react";
import CreateTextInput from "../TextInput";

interface CreateDropdownProps {
  value: string;
  options: string[];
  onChange?: (option: string) => void;
  onMenuStateChange?: (state: boolean) => void;
  onNextStepKeyboard?: () => void;
}

const CreateDropdown: FC<CreateDropdownProps> = ({
  value,
  options,
  onChange,
  onMenuStateChange,
  onNextStepKeyboard,
}) => {
  const [query, setQuery] = useState(value);
  const [showOptions, setShowOptions] = useState(false);
  const filteredOptions =
    query === ""
      ? options
      : options.filter(option => {
          return option.toLowerCase().includes(query.toLowerCase());
        });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onMenuStateChange?.(showOptions);
  }, [showOptions, onMenuStateChange]);

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

  const handleInputChange = (value: string) => {
    setQuery(value);
    onChange?.(value);

    if (value !== "" && filteredOptions.length > 0) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const handleOptionClick = (option: string) => {
    setQuery(option);
    setShowOptions(false);
    onChange?.(option);
  };

  const handleIconClick = () => {
    setShowOptions(!showOptions);
  };

  // Comment keyboard events for now, until we can figure out how to make it work with the new design since enter goes to next step
  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (!showOptions) return;

  //     switch (event.key) {
  //       case "ArrowDown":
  //         event.preventDefault();
  //         setFocusedOption(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
  //         break;
  //       case "ArrowUp":
  //         event.preventDefault();
  //         setFocusedOption(prev => (prev > 0 ? prev - 1 : prev));
  //         break;
  //       case "Enter":
  //         event.preventDefault();
  //         if (filteredOptions.length === 1) {
  //           handleOptionClick(filteredOptions[0]);
  //         } else if (focusedOption !== -1) {
  //           handleOptionClick(filteredOptions[focusedOption]);
  //         }
  //         break;
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, [showOptions, focusedOption, filteredOptions, handleOptionClick]);

  return (
    <div className="flex relative" ref={wrapperRef}>
      <CreateTextInput
        value={query}
        onChange={value => handleInputChange(value)}
        placeholder="eg. “hackathon,” “bounty,” “election”"
        onNextStep={onNextStepKeyboard}
      />
      <ChevronDownIcon className="w-5 cursor-pointer -ml-[20px]" onClick={handleIconClick} />
      {showOptions && (
        <ul className="flex flex-col gap-1 absolute z-10 mt-14 list-none  bg-true-black w-[600px] border border-primary-10 rounded-[10px] animate-appear">
          {filteredOptions.map(option => (
            <li
              className="pl-4 pt-1 pb-1  text-neutral-11 text-[18px] hover:bg-neutral-3
               cursor-pointer transition-colors duration-300 ease-in-out"
              key={option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateDropdown;
