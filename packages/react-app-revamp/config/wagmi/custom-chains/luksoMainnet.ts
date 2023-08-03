import { Chain } from "wagmi";

export const luksoMainnet: Chain = {
  id: 42,
  name: "luksoMainnet",
  network: "luksoMainnet",
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
    etherscan: { name: "Lukso Mainnet Block Explorer", url: "https://explorer.execution.mainnet.lukso.network" },
    default: { name: "Lukso Mainnet Block Explorer", url: "https://explorer.execution.mainnet.lukso.network" },
  },
};
