import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, XIcon } from "@heroicons/react/outline";
import { FC, Fragment, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export type Sorting = {
  property: string;
  ascending: boolean;
};

export interface SortProps {
  onSortChange?: (newSorting: Sorting | null) => void;
  onMenuStateChange?: (isOpen: boolean) => void;
}

const Sort: FC<SortProps> = ({ onSortChange, onMenuStateChange }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSortChange = (property: string) => {
    setSelectedOption(property);
    onSortChange?.({ property, ascending: false });
  };

  const handleResetSort = (event: React.MouseEvent, close: () => void) => {
    event.stopPropagation();
    setSelectedOption(null);
    onSortChange?.(null);

    close(); // Close the menu
  };

  return (
    <Menu as="div" className="relative inline-block text-left text-[18px] w-[100%]">
      {({ open }) => {
        onMenuStateChange?.(open);

        return (
          <>
            <div
              className={`bg-true-black rounded-xl border border-neutral-9 h-10 ${
                selectedOption || open ? "border-primary-10" : "border-neutral-9"
              }`}
            >
              <Menu.Button className="flex items-center justify-between pl-2 pr-2 w-[100%] h-[100%]">
                Sort <ChevronDownIcon className="w-5" />{" "}
              </Menu.Button>
            </div>

            {open && (
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-4 w-[100%] origin-top-right rounded-md bg-true-black shadow-lg dropdownBorder focus:outline-none">
                  {[
                    { property: "rewards", label: "rewards" },
                    { property: "qualified", label: "what i qualify for" },
                    { property: "closest_deadline", label: "closest deadline" },
                    { property: "can_submit", label: "can submit now" },
                    { property: "can_vote", label: "can vote now" },
                  ].map(({ property, label }) => (
                    <Menu.Item key={property}>
                      {({ active, close }) => (
                        <div
                          className={classNames(
                            active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                            "flex items-center gap-1 px-4 py-2 text-[18px] font-normal hover:bg-gray-100 hover:text-gray-900 cursor-pointer",
                          )}
                          onClick={() => handleSortChange(property)}
                        >
                          <span className="text-left">{label}</span>

                          {selectedOption === property && (
                            <button onClick={e => handleResetSort(e, close)} className="ml-auto">
                              <XIcon className="w-7 h-7 text-negative-11" />
                            </button>
                          )}
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            )}
          </>
        );
      }}
    </Menu>
  );
};

export default Sort;
