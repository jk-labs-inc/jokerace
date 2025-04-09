import { Chain } from "@rainbow-me/rainbowkit";

export const unichain: Chain = {
  id: 130,
  name: "unichain",
  iconUrl: "/unichain.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [ "https://mainnet.unichain.org/" ] },
    default: { http: [ "https://mainnet.unichain.org/" ] },
  },
  blockExplorers: {
    etherscan: { name: "Unichain Mainnet Scan", url: "https://uniscan.xyz/" },
    default: { name: "Unichain Mainnet Scan", url: "https://uniscan.xyz/" },
  },
};
