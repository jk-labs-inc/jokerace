import { Chain } from "@rainbow-me/rainbowkit";

export const nautilusChain: Chain = {
  id: 22222,
  name: "nautilusChain",
  iconUrl: "/nautiluschain.png",
  nativeCurrency: {
    decimals: 18,
    name: "ZBC",
    symbol: "ZBC",
  },
  rpcUrls: {
    public: {
      http: ["https://api.nautilus.nautchain.xyz/"],
    },
    default: {
      http: ["https://api.nautilus.nautchain.xyz/"],
    },
  },
  blockExplorers: {
    default: { name: "Nautilus Chain Block Explorer", url: "https://nautscan.com/" },
  },
};
