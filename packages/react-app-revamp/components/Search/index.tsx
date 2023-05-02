import { SearchIcon } from "@heroicons/react/outline";
import React, { ChangeEvent, useState } from "react";
import { debounce } from "underscore";

interface SearchProps {
  onSearchChange?: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState("");

  const debouncedOnSearchChange = debounce((value: string) => {
    onSearchChange?.(value);
  }, 300);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedOnSearchChange(value);
  };

  return (
    <div
      className={`flex items-center h-10 bg-true-black text-[16px] w-[250px] border-2 rounded-xl ${
        searchValue ? "border-primary-10" : "border-neutral-9"
      } transition-colors duration-300 ease-in-out`}
    >
      <span className="text-neutral-11">
        <SearchIcon
          className={`w-5 ml-2 transition-colors duration-300 ease-in-out ${
            searchValue ? "text-true-white" : "text-neutral-9"
          }`}
        />
      </span>
      <input
        className="bg-transparent text-true-white ml-4 outline-none placeholder-neutral-10"
        type="text"
        placeholder="search contests"
        value={searchValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;
