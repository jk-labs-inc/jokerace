import { Chain } from "@rainbow-me/rainbowkit";

export const nearAuroraMainnet: Chain = {
  id: 1313161554,
  name: "nearAuroraMainnet",
  network: "nearAuroraMainnet",
  iconUrl: "/aurora.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://mainnet.aurora.dev"],
    },
    default: {
      http: ["https://mainnet.aurora.dev"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Near Aurora Mainnet Block Explorer", url: "https://mainnet.aurorascan.dev/" },
    default: { name: "Near Aurora Mainnet Block Explorer", url: "https://mainnet.aurorascan.dev/" },
  },
};
