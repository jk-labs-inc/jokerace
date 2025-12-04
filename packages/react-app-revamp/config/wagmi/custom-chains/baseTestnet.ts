import { Chain } from "@rainbow-me/rainbowkit";

export const baseTestnet: Chain = {
  id: 84532,
  name: "baseTestnet",
  iconUrl: "/base.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://base-sepolia.drpc.org`] },
    default: {
      http: [
        `https://${import.meta.env.VITE_QUICKNODE_SLUG}.base-sepolia.quiknode.pro/${import.meta.env.VITE_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Base Testnet Scan", url: "https://sepolia.basescan.org/" },
    default: { name: "Base Testnet Scan", url: "https://sepolia.basescan.org/" },
  },
  testnet: true,
};
