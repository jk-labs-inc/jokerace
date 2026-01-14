import { ChainWithIcon } from "./types";

export const mode: ChainWithIcon = {
  id: 34443,
  name: "mode",
  iconUrl: "/mode.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://mainnet.mode.network/"],
    },
    default: {
      http: ["https://mainnet.mode.network/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Mode Mainnet Scan ", url: "https://explorer.mode.network/" },
    default: { name: "Mode Mainnet Scan", url: "https://explorer.mode.network/" },
  },
};
