import { Chain } from "@rainbow-me/rainbowkit";

export const mainnet: Chain = {
  id: 1,
  name: "mainnet",
  network: "mainnet",
  iconUrl: "/ethereum.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://eth.llamarpc.com"],
    },
    default: {
      http: [`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Etherscan", url: "https://https://etherscan.io/" },
    default: { name: "Etherscan", url: "https://https://etherscan.io/" },
  },
};
