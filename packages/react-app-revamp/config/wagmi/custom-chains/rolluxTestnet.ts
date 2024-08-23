import { Chain } from "@rainbow-me/rainbowkit";

export const rolluxTestnet: Chain = {
  id: 57000,
  name: "rolluxTestnet",
  iconUrl: "/rollux.svg",
  nativeCurrency: {
    decimals: 18,
    name: "TSYS",
    symbol: "TSYS",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc-tanenbaum.rollux.com"],
    },
    default: {
      http: ["https://rpc-tanenbaum.rollux.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Rollux Testnet Block Explorer", url: "https://rollux.tanenbaum.io/" },
    default: { name: "Rollux Testnet Block Explorer", url: "https://rollux.tanenbaum.io/" },
  },
  testnet: true,
};
