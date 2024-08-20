import { Chain } from "@rainbow-me/rainbowkit";

export const kakarotTestnet: Chain = {
  id: 1802203764,
  name: "kakarotTestnet",
  iconUrl: "/kakarot.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://sepolia-rpc.kakarot.org/"],
    },
    default: {
      http: ["https://sepolia-rpc.kakarot.org/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Kakarot Testnet Block Explorer", url: "https://sepolia.kakarotscan.org/" },
    default: { name: "Kakarot Testnet Block Explorer", url: "https://sepolia.kakarotscan.org/" },
  },
  testnet: true,
};
