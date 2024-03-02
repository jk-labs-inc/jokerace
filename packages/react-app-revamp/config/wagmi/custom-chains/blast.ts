import { Chain } from "@rainbow-me/rainbowkit";

export const blast: Chain = {
  id: 81457,
  name: "blast",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.blast.io/"],
    },
    default: {
      http: ["https://rpc.blast.io/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Blast Mainnet Scan", url: "https://blastscan.io//" },
    default: { name: "Blast Mainnet Scan", url: "https://blastscan.io//" },
  },
};
