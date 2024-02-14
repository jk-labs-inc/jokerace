import { Chain } from "@rainbow-me/rainbowkit";

export const aevo: Chain = {
  id: 2999,
  name: "aevo",
  network: "aevo",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://l2-aevo-mainnet-prod-0.t.conduit.xyz"],
    },
    default: {
      http: ["https://l2-aevo-mainnet-prod-0.t.conduit.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Aevo Mainnet Etherscan", url: "https://explorerl2new-aevo-mainnet-prod-0.t.conduit.xyz/" },
    default: { name: "Aevo Mainnet Etherscan", url: "https://explorerl2new-aevo-mainnet-prod-0.t.conduit.xyz/" },
  },
};
