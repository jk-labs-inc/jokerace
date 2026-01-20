import { Chain } from "viem";

export type ChainWithIcon = Chain & {
  iconUrl?: string;
};
