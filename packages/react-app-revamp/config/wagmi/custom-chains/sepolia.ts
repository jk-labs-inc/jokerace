import { Chain } from "wagmi";

export const sepolia: Chain = {
  id: 11155111,
  name: "sepolia",
  network: "sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://eth-sepolia-public.unifra.io"],
    },
    default: {
      http: ["https://eth-sepolia-public.unifra.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Sepolia Etherscan", url: "https://sepolia.etherscan/" },
    default: { name: "Sepolia Otterscan", url: "https://sepolia.otterscan/" },
  },
};
