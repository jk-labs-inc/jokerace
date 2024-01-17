import { Option } from "@components/_pages/Create/components/Dropdown";

export const requirementsDropdownOptions: Option[] = [
  { value: "erc20Holders", label: "token holders" },
  { value: "nftHolders", label: "NFT holders" },
];

export const chainDropdownOptions: Option[] = [
  {
    value: "mainnet",
    label: "ethereum",
  },
  {
    value: "polygon",
    label: "polygon",
  },
  {
    value: "arbitrumone",
    label: "arbitrum",
  },
  {
    value: "optimism",
    label: "optimism",
  },
  {
    value: "base",
    label: "base",
  },
];

export const votingPowerOptions: Option[] = [
  {
    value: "token",
    label: "token",
  },
  {
    value: "token holder",
    label: "token holder",
  },
];
