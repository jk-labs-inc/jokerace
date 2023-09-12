import { Chain } from "wagmi";

export const polygonTestnet: Chain = {
  id: 80001,
  name: "polygonTestnet",
  network: "polygonTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    public: {
      http: ["https://polygon-mumbai-bor.publicnode.com"],
    },
    default: {
      http: ["https://polygon-mumbai-bor.publicnode.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon Mumbai Etherscan", url: "https://mumbai.polygonscan.com/" },
    default: { name: "Polygon Mumbai Etherscan", url: "https://mumbai.polygonscan.com/" },
  },
};
