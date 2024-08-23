import { Chain } from "@rainbow-me/rainbowkit";

export const syscoinTestnet: Chain = {
  id: 5700,
  name: "syscoinTestnet",
  iconUrl: "/syscoin.svg",
  nativeCurrency: {
    decimals: 18,
    name: "tSYS",
    symbol: "tSYS",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.tanenbaum.io"],
    },
    default: {
      http: ["https://rpc.tanenbaum.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Syscoin Testnet Block Explorer", url: "https://tanenbaum.io/" },
    default: { name: "Syscoin Testnet Block Explorer", url: "https://tanenbaum.io/" },
  },
  testnet: true,
};
