import { Chain } from "@rainbow-me/rainbowkit";

export const goerli: Chain = {
  id: 5,
  name: "goerli",
  network: "goerli",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://ethereum-goerli.publicnode.com"],
    },
    default: {
      http: ["https://ethereum-goerli.publicnode.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Goerli Etherscan", url: "https://goerli.etherscan.io/" },
    default: { name: "Goerli Etherscan", url: "https://goerli.etherscan.io/" },
  },
};
