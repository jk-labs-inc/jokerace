import { Chain } from "@rainbow-me/rainbowkit";

export const formaTestnet: Chain = {
  id: 984123,
  name: "formaTestnet",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "TIA",
    symbol: "TIA",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.sketchpad-1.forma.art"],
    },
    default: {
      http: ["https://rpc.sketchpad-1.forma.art"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Forma Block Explorer", url: "https://explorer.sketchpad-1.forma.art" },
    default: { name: "Forma Block Explorer", url: "https://explorer.sketchpad-1.forma.art" },
  },
  testnet: true,
};
