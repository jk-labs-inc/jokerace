import { Chain } from "@rainbow-me/rainbowkit";

export const morph: Chain = {
  id: 2818,
  name: "morph",
  iconUrl: "/morph.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.morphl2.io/"],
    },
    default: {
      http: ["https://rpc.morphl2.io/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Morph Mainnet Scan ", url: "https://explorer.morphl2.io/" },
    default: { name: "Morph Mainnet Scan", url: "https://explorer.morphl2.io/" },
  },
};
