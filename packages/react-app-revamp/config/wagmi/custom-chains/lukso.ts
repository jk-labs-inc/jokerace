import { Chain } from "@rainbow-me/rainbowkit";

export const lukso: Chain = {
  id: 42,
  name: "lukso",
  network: "lukso",
  iconUrl: "/lukso.svg",
  nativeCurrency: {
    decimals: 18,
    name: "LYX",
    symbol: "LYX",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.lukso.gateway.fm"],
    },
    default: {
      http: ["https://rpc.lukso.gateway.fm"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Lukso Mainnet Block Explorer", url: "https://explorer.execution.mainnet.lukso.network/" },
    default: { name: "Lukso Mainnet Block Explorer", url: "https://explorer.execution.mainnet.lukso.network/" },
  },
};
