import { Chain } from "@rainbow-me/rainbowkit";

export const bnb: Chain = {
  id: 56,
  name: "bnb",
  iconUrl: "/bnb.png",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    public: { http: ["https://binance.llamarpc.com"] },
    default: { http: ["https://binance.llamarpc.com"] },
  },
  blockExplorers: {
    etherscan: { name: "BNB Mainnet Scan", url: "https://bnbscan.org/" },
    default: { name: "BNB Mainnet Scan", url: "https://bnbscan.org/" },
  },
};
