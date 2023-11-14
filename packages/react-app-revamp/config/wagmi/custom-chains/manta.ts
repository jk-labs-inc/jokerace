import { Chain } from "@rainbow-me/rainbowkit";

export const manta: Chain = {
  id: 169,
  name: "manta",
  network: "manta",
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
    etherscan: { name: "Manta Etherscan", url: "https://pacific-explorer.manta.network" },
    default: { name: "Manta Etherscan", url: "https://pacific-explorer.manta.network" },
  },
};
