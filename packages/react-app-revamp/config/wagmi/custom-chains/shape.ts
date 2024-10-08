import { Chain } from "@rainbow-me/rainbowkit";

export const shape: Chain = {
  id: 360,
  name: "shape",
  iconUrl: "/shape.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://mainnet.shape.network"] },
    default: { http: ["https://mainnet.shape.network"] },
  },
  blockExplorers: {
    etherscan: { name: "Shape Mainnet Scan", url: "https://shapescan.xyz/" },
    default: { name: "Shape Mainnet Scan", url: "https://shapescan.xyz/" },
  },
};
