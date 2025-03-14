import { Chain } from "@rainbow-me/rainbowkit";

export const soneium: Chain = {
  id: 1868,
  name: "soneium",
  iconUrl: "/soneium.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc.soneium.org/"] },
    default: { http: ["https://rpc.soneium.org/"] },
  },
  blockExplorers: {
    etherscan: { name: "Soneium Mainnet Scan", url: "https://soneium.blockscout.com/" },
    default: { name: "Soneium Mainnet Scan", url: "https://soneium.blockscout.com/" },
  },
};
