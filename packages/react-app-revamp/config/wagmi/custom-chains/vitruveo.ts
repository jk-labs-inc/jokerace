import { Chain } from "@rainbow-me/rainbowkit";

export const vitruveo: Chain = {
  id: 1490,
  name: "vitruveo",
  iconUrl: "/vitruveo.svg",
  nativeCurrency: {
    decimals: 18,
    name: "VTRU",
    symbol: "VTRU",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.vitruveo.xyz"],
    },
    default: {
      http: ["https://rpc.vitruveo.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Vitruveo Etherscan", url: "https://explorer.vitruveo.xyz" },
    default: { name: "Vitruveo Etherscan", url: "https://explorer.vitruveo.xyz" },
  },
};
