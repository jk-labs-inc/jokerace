import { Chain } from "@rainbow-me/rainbowkit";

export const ancient8: Chain = {
  id: 888888888,
  name: "ancient8",
  network: "ancient8",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.ancient8.gg/"],
    },
    default: {
      http: ["https://rpc.ancient8.gg/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Ancient8 Mainnet Scan", url: "https://scan.ancient8.gg/" },
    default: { name: "Ancient8 Mainnet Scan", url: "https://scan.ancient8.gg/" },
  },
};
