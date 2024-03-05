import { Chain } from "@rainbow-me/rainbowkit";

export const dymension: Chain = {
  id: 1100,
  name: "dymension",
  iconUrl: "/dymension.png",
  nativeCurrency: {
    decimals: 18,
    name: "DYM",
    symbol: "DYM",
  },
  rpcUrls: {
    public: {
      http: ["https://jsonrpc.dymension.nodestake.org"],
    },
    default: {
      http: ["https://jsonrpc.dymension.nodestake.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Dymension Mainnet Explorer", url: "https://dym.fyi/" },
    default: { name: "Dymension Mainnet Explorer", url: "https://dym.fyi/" },
  },
};
