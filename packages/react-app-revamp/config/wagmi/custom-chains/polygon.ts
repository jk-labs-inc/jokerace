import { Chain } from "wagmi";

export const polygon: Chain = {
  id: 137,
  name: "polygon",
  network: "polygon",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    public: {
      http: ["https://polygon-bor.publicnode.com"],
    },
    default: {
      http: ["https://polygon-bor.publicnode.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon Mainnet Etherscan", url: "https://polygonscan.com/" },
    default: { name: "Polygon Mainnet Etherscan", url: "https://polygonscan.com/" },
  },
};
