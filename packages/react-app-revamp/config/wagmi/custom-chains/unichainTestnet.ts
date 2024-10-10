import { Chain } from "@rainbow-me/rainbowkit";

export const unichainTestnet: Chain = {
  id: 1301,
  name: "unichainTestnet",
  iconUrl: "/unichain.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://unichain-sepolia.unichain.org"],
    },
    default: {
      http: ["https://unichain-sepolia.unichain.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Unichain Testnet Scan", url: "https://unichain-sepolia.blockscout.com/" },
    default: { name: "Unichain Testnet Scan", url: "https://unichain-sepolia.blockscout.com/" },
  },
  testnet: true,
};
