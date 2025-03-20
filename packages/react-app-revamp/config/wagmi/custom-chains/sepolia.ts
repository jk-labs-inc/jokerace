import { Chain } from "@rainbow-me/rainbowkit";

export const sepolia: Chain = {
  id: 11155111,
  name: "sepolia",
  iconUrl: "/mainnet.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://eth-sepolia.public.blastapi.io"],
    },
    default: {
      http: [`https://eth-sepolia.public.blastapi.io`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Sepolia Etherscan", url: "https://sepolia.etherscan.io/" },
    default: { name: "Sepolia Etherscan", url: "https://sepolia.etherscan.io/" },
  },
  testnet: true,
};
