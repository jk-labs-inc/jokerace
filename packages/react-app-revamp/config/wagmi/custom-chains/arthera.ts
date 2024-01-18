import { Chain } from "@rainbow-me/rainbowkit";

export const arthera: Chain = {
  id: 10242,
  name: "arthera",
  network: "arthera",
  iconUrl: "/arthera.svg",
  nativeCurrency: {
    decimals: 18,
    name: "AA",
    symbol: "AA",
  },
  rpcUrls: {
    public: { http: ["https://rpc.arthera.net"] },
    default: { http: ["https://rpc.arthera.net"] },
  },
  blockExplorers: {
    etherscan: { name: "Arthera Mainnet Scan", url: "https://explorer.arthera.net/" },
    default: { name: "Arthera Mainnet Scan", url: "https://explorer.arthera.net/" },
  },
};
