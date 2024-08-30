import { Chain } from "@rainbow-me/rainbowkit";

export const soneiumTestnet: Chain = {
  id: 1946,
  name: "soneiumTestnet",
  iconUrl: "/soneium.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.minato.soneium.org"],
    },
    default: {
      http: ["https://rpc.minato.soneium.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Soneium Testnet Scan", url: "https://explorer-testnet.soneium.org/" },
    default: { name: "Soneium Testnet Scan", url: "https://explorer-testnet.soneium.org/" },
  },
  testnet: true,
};
