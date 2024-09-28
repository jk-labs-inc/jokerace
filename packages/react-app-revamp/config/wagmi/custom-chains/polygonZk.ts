import { Chain } from "@rainbow-me/rainbowkit";

export const polygonZk: Chain = {
  id: 1101,
  name: "polygonZk",
  iconUrl: "/polygon.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://zkevm-rpc.com"],
    },
    default: {
      http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.zkevm-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon zkEvm Mainnet Scan", url: "https://zkevm.polygonscan.com/" },
    default: { name: "Polygon zkEvm Mainnet Scan", url: "https://zkevm.polygonscan.com/" },
  },
};
