import { Chain } from "@rainbow-me/rainbowkit";

export const metis: Chain = {
  id: 1088,
  name: "metis",
  iconUrl: "/metis.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Metis",
    symbol: "METIS",
  },
  rpcUrls: {
    public: { http: ["https://andromeda.metis.io/?owner=1088"] },
    default: { http: ["https://andromeda.metis.io/?owner=1088"] },
  },
  blockExplorers: {
    etherscan: { name: "Metis Mainnet Scan", url: "https://andromeda-explorer.metis.io/" },
    default: { name: "Metis Mainnet Scan", url: "https://andromeda-explorer.metis.io/" },
  },
};
