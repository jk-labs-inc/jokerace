import { Option } from "@components/_pages/Create/components/TagDropdown";

export const requirementsDropdownOptions: Option[] = [
  { value: "erc20", label: "token holders" },
  { value: "erc721", label: "NFT holders" },
];

export const nftChainDropdownOptions: Option[] = [
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

export const erc20ChainDropdownOptions: Option[] = [
  {
    value: "mainnet",
    label: "ethereum",
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
