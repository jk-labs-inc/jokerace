import { Combobox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, useState } from "react";
import ErrorMessage from "../Error";

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
  option: string;
  step: number;
  maxLength?: number;
  errorMessage?: string;
  onOptionChange?: (option: string) => void;
  onMenuStateChange?: (isOpen: boolean) => void;
}

const CreateDropdown: FC<CreateDropdownProps> = ({
  option,
  step,
  onOptionChange,
  onMenuStateChange,
  maxLength = 100,
  errorMessage = "Input is too long",
}) => {
  const { errors, setError } = useDeployContestStore(state => state);

  const [selectedOption, setSelectedOption] = useState("");
  const [query, setQuery] = useState(option);

  console.log({ query });

  const filteredOptions =
    query === ""
      ? options
      : options.filter(option => {
          return option.toLowerCase().includes(query.toLowerCase());
        });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length >= maxLength) {
      onOptionChange?.(event.target.value);
      setError(step, { step, message: errorMessage });
    } else {
      onOptionChange?.(event.target.value);
      setQuery(event.target.value);
      setError(step, { step, message: "" });
    }
  };

  const currentError = errors.find(error => error.step === step);

  return (
    <div className="relative w-[400px]">
      <Combobox value={selectedOption} onChange={setSelectedOption} nullable>
        {({ open }) => {
          onMenuStateChange?.(open);

          return (
            <>
              <div className="flex border-b border-neutral-11 w-full">
                <Combobox.Input
                  value={option}
                  onChange={handleInputChange}
                  maxLength={maxLength}
                  className="bg-transparent outline-none w-full placeholder-neutral-9 pb-2"
                  placeholder="eg. “hackathon,” “bounty,” “election”"
                />
                <Combobox.Button>
                  <ChevronDownIcon className="w-5 cursor-pointer" />
                </Combobox.Button>
              </div>

              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Combobox.Options
                  className="absolute z-10 flex flex-col gap-2
             border-2 border-primary-10 w-full rounded-xl pl-4 pt-2 mt-5 pb-2 cursor-pointer bg-white"
                >
                  {filteredOptions.map(option => (
                    <Combobox.Option
                      key={option}
                      value={option}
                      className="text-[18px] font-normal hover:bg-gray-100 transition-colors duration-300 ease-in-out"
                    >
                      {option}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Transition>
            </>
          );
        }}
      </Combobox>
      <ErrorMessage error={currentError?.message ?? ""} />
    </div>
  );
};

export default CreateDropdown;
