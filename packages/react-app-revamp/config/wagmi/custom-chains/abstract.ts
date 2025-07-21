import { Chain } from "@rainbow-me/rainbowkit";

export const abstract: Chain = {
  id: 2741,
  name: "abstract",
  iconUrl: "/abstract.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://api.mainnet.abs.xyz"] },
    default: { http: ["https://api.mainnet.abs.xyz"] },
  },
  blockExplorers: {
    etherscan: { name: "Abstract Mainnet Scan", url: "https://abscan.org/" },
    default: { name: "Abstract Mainnet Scan", url: "https://abscan.org/" },
  },
};
