import { Chain } from "@rainbow-me/rainbowkit";

export const polygonZk: Chain = {
  id: 1101,
  name: "polygonZk",
  network: "polygonZk",
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
      http: ["https://zkevm-rpc.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon zkEvm Mainnet Scan", url: "https://zkevm.polygonscan.com/" },
    default: { name: "Polygon zkEvm Mainnet Scan", url: "https://zkevm.polygonscan.com/" },
  },
};
