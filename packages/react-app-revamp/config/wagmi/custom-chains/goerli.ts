import { Chain } from "@rainbow-me/rainbowkit";

export const goerli: Chain = {
  id: 5,
  name: "goerli",
  iconUrl: "/mainnet.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://eth-goerli.public.blastapi.io	"],
    },
    default: {
      http: ["https://eth-goerli.public.blastapi.io	"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Goerli Etherscan", url: "https://goerli.etherscan.io/" },
    default: { name: "Goerli Etherscan", url: "https://goerli.etherscan.io/" },
  },
};
