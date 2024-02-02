import { Chain } from "@rainbow-me/rainbowkit";

export const taikoTestnet: Chain = {
  id: 167008,
  name: "taikoTestnet",
  network: "taikoTestnet",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.katla.taiko.xyz"],
    },
    default: {
      http: ["https://rpc.katla.taiko.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Taiko Testnet Scan", url: "https://explorer.katla.taiko.xyz/" },
    default: { name: "Taiko Testnet Scan", url: "https://explorer.katla.taiko.xyz/" },
  },
  testnet: true,
};
