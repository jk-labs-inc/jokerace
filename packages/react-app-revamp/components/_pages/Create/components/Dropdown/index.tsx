import { ChevronDownIcon } from "@heroicons/react/outline";
import { FC, useEffect, useRef, useState } from "react";
import CreateTextInput from "../TextInput";

const options = [
  "hackathon",
  "grants round",
  "bounty",
  "pulse check",
  "amend a proposal",
  "contest competition",
  "giveaway",
  "feature request",
  "curation",
  "game",
  "election",
];

interface CreateDropdownProps {
  value: string;
  onOptionChange?: (option: string) => void;
  onMenuStateChange?: (state: boolean) => void;
}

const CreateDropdown: FC<CreateDropdownProps> = ({ value, onOptionChange, onMenuStateChange }) => {
  const [query, setQuery] = useState(value);
  const [showOptions, setShowOptions] = useState(true);
  const [focusedOption, setFocusedOption] = useState(-1);
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
    onOptionChange?.(value);

    if (value !== "" && filteredOptions.length > 0) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const handleOptionClick = (option: string) => {
    setQuery(option);
    setShowOptions(false);
    onOptionChange?.(option);
  };

  const handleIconClick = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showOptions) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedOption(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedOption(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          event.preventDefault();
          if (filteredOptions.length === 1) {
            handleOptionClick(filteredOptions[0]);
          } else if (focusedOption !== -1) {
            handleOptionClick(filteredOptions[focusedOption]);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showOptions, focusedOption, filteredOptions, handleOptionClick]);

  return (
    <div className="flex relative" ref={wrapperRef}>
      <CreateTextInput
        value={query}
        onChange={value => handleInputChange(value)}
        placeholder="eg. “hackathon,” “bounty,” “election”"
      />
      <ChevronDownIcon className="w-5 cursor-pointer -ml-[20px]" onClick={handleIconClick} />
      {showOptions && (
        <ul className="flex flex-col gap-2 absolute z-10 mt-14 list-none pt-3 pb-3 pl-4 bg-true-black w-[600px] border border-primary-10 rounded-[10px] animate-appear">
          {filteredOptions.map(option => (
            <li
              className="text-neutral-11 text-[18px] hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors duration-300 ease-in-out"
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
