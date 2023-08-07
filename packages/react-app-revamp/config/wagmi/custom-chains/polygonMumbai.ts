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
      http: ["https://rpc.ankr.com/polygon_mumbai"],
    },
    default: {
      http: [`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon Mumbai Etherscan", url: "https://mumbai.polygonscan.com/" },
    default: { name: "Polygon Mumbai Etherscan", url: "https://mumbai.polygonscan.com/" },
  },
};
