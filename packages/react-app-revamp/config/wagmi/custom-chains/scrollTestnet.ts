import { Chain } from "@rainbow-me/rainbowkit";

export const scrollTestnet: Chain = {
  id: 534353,
  name: "scrollTestnet",
  iconUrl: "/scroll.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://scroll-sepolia.blockpi.network/v1/rpc/public"],
    },
    default: {
      http: ["https://scroll-sepolia.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Scroll Testnet Scan", url: "https://sepolia.scrollscan.com/" },
    default: { name: "Scroll Testnet Scan", url: "https://sepolia.scrollscan.com/" },
  },
  testnet: true,
};
