import { Chain } from "@rainbow-me/rainbowkit";

export const fraxtal: Chain = {
  id: 252,
  name: "fraxtal",
  network: "fraxtal",
  iconUrl: "/fraxtal.svg",
  nativeCurrency: {
    decimals: 18,
    name: "frxETH",
    symbol: "frxETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.frax.com/"],
    },
    default: {
      http: ["https://rpc.frax.com/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Fraxtal Block Explorer", url: "https://explorer.mainnet.frax.com" },
    default: { name: "Fraxtal Block Explorer", url: "https://explorer.mainnet.frax.com" },
  },
};
