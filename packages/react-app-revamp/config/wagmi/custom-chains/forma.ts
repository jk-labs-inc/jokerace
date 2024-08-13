import { Chain } from "@rainbow-me/rainbowkit";

export const forma: Chain = {
  id: 984122,
  name: "forma",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "TIA",
    symbol: "TIA",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.forma.art"],
    },
    default: {
      http: ["https://rpc.forma.art"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Forma Block Explorer", url: "https://explorer.forma.art" },
    default: { name: "Forma Block Explorer", url: "https://explorer.forma.art" },
  },
};
