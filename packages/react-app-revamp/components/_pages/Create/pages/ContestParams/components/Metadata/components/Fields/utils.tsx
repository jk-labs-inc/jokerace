import { Option } from "@components/_pages/Create/components/DefaultDropdown";
import { MetadataField } from "@hooks/useDeployContest/store";

export const fieldsDropdownOptions: Option[] = [
  { value: "string", label: "string" },
  { value: "integer", label: "integer" },
  { value: "address", label: "token address" },
];

export const metadataFields: MetadataField[] = [
  {
    type: "string",
    label: "string",
    promptLabel: "eg. what's your best contact info on telegram?",
    prompt: "",
    description: {
      desktop: (
        <p className="text-[20px] text-neutral-11">
          a string lets players write whatever they want in <br />
          response to your prompt, with unlimited characters.
        </p>
      ),
      mobile: (
        <p className="text-[16px] text-neutral-11">
          a string lets players respond however they like to your prompt. unlimited characters.
        </p>
      ),
    },
  },
  {
    type: "number",
    label: "integer",
    promptLabel: "eg. how much eth should we donate to this cause?",
    prompt: "",
    description: {
      desktop: (
        <p className="text-[20px] text-neutral-11">
          an integer lets players write a series of numbers in <br />
          response to your prompt, with unlimited characters.
        </p>
      ),
      mobile: (
        <p className="text-[16px] text-neutral-11">
          an integer lets players write a series of numbers in response to your prompt, with unlimited characters.
        </p>
      ),
    },
  },
  {
    type: "string",
    label: "address",
    promptLabel: "eg. who should receive the rewards?",
    prompt: "",
    description: {
      desktop: (
        <p className="text-[20px] text-neutral-11">
          players will need to give a 42 character address starting <br />
          with 0x—useful for funding other addresses.
        </p>
      ),
      mobile: (
        <p className="text-[16px] text-neutral-11">
          players will need to give a 42 character address starting with 0x—useful for funding other addresses.
        </p>
      ),
    },
  },
];
