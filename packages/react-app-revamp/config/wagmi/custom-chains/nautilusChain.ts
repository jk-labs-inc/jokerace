import { Chain } from "@rainbow-me/rainbowkit";

export const nautilusChain: Chain = {
  id: 91002,
  name: "nautilusChain",
  network: "nautilusChain",
  iconUrl: "/nautiluschain.png",
  nativeCurrency: {
    decimals: 18,
    name: "ZBC",
    symbol: "ZBC",
  },
  rpcUrls: {
    public: {
      http: ["http://api.nautilus.nautchain.xyz/"],
    },
    default: {
      http: ["http://api.nautilus.nautchain.xyz/"],
    },
  },
  blockExplorers: {
    default: { name: "Nautilus Chain Block Explorer", url: "https://nautscan.com/" },
  },
};
