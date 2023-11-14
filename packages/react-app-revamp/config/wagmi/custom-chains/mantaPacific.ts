import { Chain } from "@rainbow-me/rainbowkit";

export const mantaPacific: Chain = {
  id: 169,
  name: "mantaPacific",
  network: "mantaPacific",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://pacific-rpc.manta.network/http"],
    },
    default: {
      http: ["https://pacific-rpc.manta.network/http"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Manta Pacific Etherscan", url: "https://pacific-explorer.manta.network" },
    default: { name: "Manta Pacific Etherscan", url: "https://pacific-explorer.manta.network" },
  },
};
