import { Chain } from "@rainbow-me/rainbowkit";

export const rollux: Chain = {
  id: 570,
  name: "rollux",
  iconUrl: "/rollux.svg",
  nativeCurrency: {
    decimals: 18,
    name: "SYS",
    symbol: "SYS",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.rollux.com"],
    },
    default: {
      http: ["https://rpc.rollux.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Rollux Block Explorer", url: "https://explorer.rollux.com/" },
    default: { name: "Rollux Block Explorer", url: "https://explorer.rollux.com/" },
  },
};
