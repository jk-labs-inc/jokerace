import { ROUTE_VIEW_PAST_CONTESTS } from "@config/routes";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, XIcon } from "@heroicons/react/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, Fragment, useEffect, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export type SortOption = {
  property: string;
  label: string;
};

export interface SortProps {
  sortOptions: SortOption[];
  onSortChange?: (sortBy: string) => void;
  onMenuStateChange?: (isOpen: boolean) => void;
}

const Sort: FC<SortProps> = ({ sortOptions, onSortChange, onMenuStateChange }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const query = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sortByFromQuery = query?.get("sortBy");

  useEffect(() => {
    if (sortByFromQuery) {
      setSelectedOption(sortByFromQuery);
      setLabel(sortByFromQuery);
    }
  }, [sortByFromQuery]);

  const handleSortChange = (property: string, label: string) => {
    setSelectedOption(property);
    setLabel(label);
    onSortChange?.(property);

    if (sortByFromQuery) {
      removeQueryParam("sortBy");
    }
  };

  const handleResetSort = (event: React.MouseEvent, close: () => void) => {
    event.stopPropagation();
    setSelectedOption(null);
    setLabel(null);
    onSortChange?.("");
    close();

    if (sortByFromQuery) {
      removeQueryParam("sortBy");
    }
  };

  //TODO: check query params
  const removeQueryParam = (param: string) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, value || "");
      }
    });

    params.delete(param);
    router.replace({ pathname, query: params.toString() });
  };

  if (pathname?.includes(ROUTE_VIEW_PAST_CONTESTS)) return null;

  return (
    <Menu as="div" className="relative inline-block text-left w-full md:w-[220px] text-[16px]">
      {({ open }) => {
        onMenuStateChange?.(open);

        return (
          <>
            <div
              className={`bg-true-black rounded-xl border-2 h-10 ${
                selectedOption || open ? "border-primary-10" : "border-neutral-9"
              } transition-colors duration-300 ease-in-out`}
            >
              <Menu.Button className="flex items-center gap-3 pl-2 pr-2 w-[100%] h-[100%] cursor-pointer text-[16px]">
                <span className={`${selectedOption || open ? `text-true-white` : `text-neutral-9`}`}>
                  {label ? label : "Sort"}
                </span>
                <ChevronDownIcon className="w-5 cursor-pointer ml-auto" />{" "}
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
                <Menu.Items className="absolute w-[220px] z-10 mt-4 origin-top-right rounded-md bg-true-black shadow-lg dropdownBorder  focus:outline-none">
                  {sortOptions.map(({ property, label }) => (
                    <Menu.Item key={property}>
                      {({ active, close }) => (
                        <div
                          className={classNames(
                            active ? "bg-neutral-3 text-gray-900" : "text-gray-700",
                            "flex items-center gap-1 px-4 py-2 text-[16px] font-normal hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors duration-300 ease-in-out",
                          )}
                          onClick={() => handleSortChange(property, label)}
                        >
                          <span className={`text-left ${property === selectedOption ? `font-bold` : `font-normal`}`}>
                            {label}
                          </span>

                          {selectedOption === property && (
                            <button onClick={e => handleResetSort(e, close)} className="ml-auto">
                              <XIcon className="w-6 h-6 text-negative-11" />
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
