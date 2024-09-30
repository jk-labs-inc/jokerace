import { Chain } from "@rainbow-me/rainbowkit";

export const boba: Chain = {
  id: 288,
  name: "boba",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://gateway.tenderly.co/public/boba-ethereum"] },
    default: { http: ["https://gateway.tenderly.co/public/boba-ethereum"] },
  },
  blockExplorers: {
    etherscan: { name: "Boba Mainnet Scan", url: "https://bobascan.com/" },
    default: { name: "Boba Mainnet Scan", url: "https://bobascan.com/" },
  },
};
