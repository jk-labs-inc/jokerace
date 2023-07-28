import { Chain } from "wagmi";

export const polygon = {
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
      http: ["https://rpc.ankr.com/polygon"],
    },
    default: {
      http: [`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon Mainnet Etherscan", url: "https://polygonscan.com/" },
    default: { name: "Polygon Mainnet Etherscan", url: "https://polygonscan.com/" },
  },
} as const satisfies Chain;
