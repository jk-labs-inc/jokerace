import { Chain } from "@rainbow-me/rainbowkit";

export const polygonTestnet: Chain = {
  id: 80002,
  name: "polygonTestnet",
  iconUrl: "/polygon.svg",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.ankr.com/polygon_amoy"],
    },
    default: {
      http: [`https://polygon-amoy.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon Testnet Etherscan", url: "https://www.oklink.com/amoy/" },
    default: { name: "Polygon Testnet Etherscan", url: "https://www.oklink.com/amoy/" },
  },
  testnet: true,
};
