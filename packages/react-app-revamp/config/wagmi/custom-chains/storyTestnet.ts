import { Chain } from "@rainbow-me/rainbowkit";

export const storyTestnet: Chain = {
  id: 1513,
  name: "storyTestnet",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "IP",
    symbol: "IP",
  },
  rpcUrls: {
    public: {
      http: ["https://testnet.storyrpc.io"],
    },
    default: {
      http: ["https://testnet.storyrpc.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Story Testnet Scan", url: "https://testnet.storyscan.xyz/" },
    default: { name: "Story Testnet Scan", url: "https://testnet.storyscan.xyz/" },
  },
  testnet: true,
};
