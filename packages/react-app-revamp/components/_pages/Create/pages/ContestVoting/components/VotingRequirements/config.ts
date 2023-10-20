import { Option } from "@components/_pages/Create/components/Dropdown";

export const requirementsDropdownOptions: Option[] = [
  { value: "NFT holders" },
  { value: "token holders", disabled: true },
];

export const chainDropdownOptions: Option[] = [
  {
    value: "mainnet",
  },
  {
    value: "polygon",
  },
  {
    value: "optimism",
  },
  {
    value: "arbitrum",
  },
  {
    value: "base",
  },
];

export const votingPowerOptions: Option[] = [
  {
    value: "token",
  },
  {
    value: "token holder",
  },
];
