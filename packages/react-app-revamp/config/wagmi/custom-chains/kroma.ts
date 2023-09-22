import { Chain } from "@rainbow-me/rainbowkit";

export const kroma: Chain = {
  id: 255,
  name: "kroma",
  network: "kroma",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://api.kroma.network"],
    },
    default: {
      http: ["https://api.kroma.network"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Kroma Mainnet Block Explorer", url: "https://blockscout.kroma.network/" },
    default: { name: "Kroma Mainnet Block Explorer", url: "https://blockscout.kroma.network/" },
  },
};
