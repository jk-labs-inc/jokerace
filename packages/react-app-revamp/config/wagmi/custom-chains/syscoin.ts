import { Chain } from "@rainbow-me/rainbowkit";

export const syscoin: Chain = {
  id: 57,
  name: "syscoin",
  iconUrl: "/syscoin.svg",
  nativeCurrency: {
    decimals: 18,
    name: "SYS",
    symbol: "SYS",
  },
  rpcUrls: {
    public: {
      http: ["https://syscoin.public-rpc.com"],
    },
    default: {
      http: ["https://syscoin.public-rpc.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Syscoin Block Explorer", url: "https://explorer.syscoin.org/" },
    default: { name: "Syscoin Block Explorer", url: "https://explorer.syscoin.org/" },
  },
};
