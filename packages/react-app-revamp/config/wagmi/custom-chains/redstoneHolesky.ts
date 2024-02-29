import { Chain } from "@rainbow-me/rainbowkit";

export const redstoneHolesky: Chain = {
  id: 17001,
  name: "redstoneHolesky",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.holesky.redstone.xyz"],
    },
    default: {
      http: ["https://rpc.holesky.redstone.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Redstone Holesky Etherscan", url: "https://explorer.holesky.redstone.xyz/" },
    default: { name: "Redstone Holesky Etherscan", url: "https://explorer.holesky.redstone.xyz/" },
  },
};
