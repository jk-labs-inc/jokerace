import { chainsImages } from "@config/wagmi";
import { TokenConfig } from "./tokens";

export const getTokenImage = (token: TokenConfig, chainName: string) => {
  if (token.address) {
    return `/tokens/${token.name.toLowerCase()}.svg`;
  } else if (token.symbol === "ETH") {
    return "/tokens/ether.svg";
  } else {
    return chainsImages[chainName.toLowerCase().replace(" ", "")];
  }
};
