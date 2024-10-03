import { Chain } from "@rainbow-me/rainbowkit";

export const plumeTestnet: Chain = {
  id: 18230,
  name: "plumeTestnet",
  iconUrl: "/plume.svg",
  nativeCurrency: {
    decimals: 18,
    name: "P",
    symbol: "P",
  },
  rpcUrls: {
    public: {
      http: ["https://devnet-rpc.plumenetwork.xyz/"],
    },
    default: {
      http: ["https://devnet-rpc.plumenetwork.xyz/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Plume Testnet Scan", url: "https://devnet-explorer.plumenetwork.xyz/" },
    default: { name: "Plume Testnet Scan", url: "https://devnet-explorer.plumenetwork.xyz/" },
  },
  testnet: true,
};
