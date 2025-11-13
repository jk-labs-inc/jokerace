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
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.base-sepolia.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Base Testnet Scan", url: "https://sepolia.basescan.org/" },
    default: { name: "Base Testnet Scan", url: "https://sepolia.basescan.org/" },
  },
  testnet: true,
};
