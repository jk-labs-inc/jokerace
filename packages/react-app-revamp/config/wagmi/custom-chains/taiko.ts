import { Chain } from "@rainbow-me/rainbowkit";

export const taiko: Chain = {
  id: 167000,
  name: "taiko",
  iconUrl: "/taiko.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.mainnet.taiko.xyz/"],
    },
    default: {
      http: ["https://rpc.mainnet.taiko.xyz/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Taiko", url: "https://taikoscan.network/" },
    default: { name: "Taiko", url: "https://taikoscan.network/" },
  },
  testnet: true,
};
