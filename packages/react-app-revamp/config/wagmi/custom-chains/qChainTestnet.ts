import { Chain } from "@rainbow-me/rainbowkit";

export const qChainTestnet: Chain = {
  id: 35443,
  name: "qChainTestnet",
  network: "qChainTestnet",
  iconUrl: "/qchain.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.qtestnet.org"],
    },
    default: {
      http: ["https://rpc.qtestnet.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Q Testnet Scan", url: "https://explorer.qtestnet.org/" },
    default: { name: "Q Testnet Scan", url: "https://explorer.qtestnet.org/" },
  },
  testnet: true,
};
