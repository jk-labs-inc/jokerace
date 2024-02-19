import { Chain } from "@rainbow-me/rainbowkit";

export const fraxtalTestnet: Chain = {
  id: 2522,
  name: "fraxtalTestnet",
  iconUrl: "/fraxtal.svg",
  nativeCurrency: {
    decimals: 18,
    name: "frxETH",
    symbol: "frxETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.testnet.frax.com"],
    },
    default: {
      http: ["https://rpc.testnet.frax.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Fraxtal Testnet Block Explorer", url: "https://explorer.testnet.frax.com" },
    default: { name: "Fraxtal Testnet Block Explorer", url: "https://explorer.testnet.frax.com" },
  },
  testnet: true,
};
