import { Chain } from "@rainbow-me/rainbowkit";

export const polygon: Chain = {
  id: 137,
  name: "polygon",
  network: "polygon",
  iconUrl: "/polygon.svg",
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
};
