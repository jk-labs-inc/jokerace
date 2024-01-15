import { Chain } from "@rainbow-me/rainbowkit";

export const holesky: Chain = {
  id: 17000,
  name: "holesky",
  network: "holesky",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://ethereum-holesky.publicnode.com"],
    },
    default: {
      http: ["https://ethereum-holesky.publicnode.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Holesky Etherscan", url: "https://holesky.etherscan.io/" },
    default: { name: "Holesky Etherscan", url: "https://holesky.etherscan.io/" },
  },
};
