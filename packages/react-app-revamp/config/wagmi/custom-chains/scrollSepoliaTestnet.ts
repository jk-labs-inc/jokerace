import { Chain } from "@rainbow-me/rainbowkit";

export const scrollSepoliaTestnet: Chain = {
  id: 534351,
  name: "scrollSepoliaTestnet",
  network: "scrollSepoliaTestnet",
  iconUrl: "/scroll.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://sepolia-rpc.scroll.io/"],
    },
    default: {
      http: ["https://sepolia-rpc.scroll.io/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Scroll Sepolia Scan", url: "https://sepolia-blockscout.scroll.io/" },
    default: { name: "Scroll Sepolia Scan", url: "https://sepolia-blockscout.scroll.io/" },
  },
};
