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
  }, 300); // Set the debounce time in milliseconds, e.g., 300ms

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedOnSearchChange(value);
  };

  return (
    <div className="flex items-center h-10 bg-true-black text-[16px] w-[80%] border-b border-neutral-10">
      <span className="text-neutral-11">
        <SearchIcon className="w-5" color="gray" />
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
