import { Chain } from "@rainbow-me/rainbowkit";

export const ronin: Chain = {
  id: 2020,
  name: "ronin",
  network: "ronin",
  nativeCurrency: {
    decimals: 18,
    name: "RON",
    symbol: "RON",
  },
  rpcUrls: {
    public: {
      http: ["https://api.roninchain.com/rpc"],
    },
    default: {
      http: ["https://api.roninchain.com/rpc"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Ronin Scan", url: "https://app.roninchain.com/" },
    default: { name: "Ronin Scan", url: "https://app.roninchain.com/" },
  },
};
