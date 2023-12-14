import { Chain } from "@rainbow-me/rainbowkit";

export const bnb: Chain = {
  id: 56,
  name: "bnb",
  network: "bnb",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    public: {
      http: ["https://bsc-dataseed.binance.org/"],
    },
    default: {
      http: ["https://bsc-dataseed.binance.org/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "BNB Explorer", url: "https://bscscan.com/" },
    default: { name: "BNB Explorer", url: "https://bscscan.com/" },
  },
};
