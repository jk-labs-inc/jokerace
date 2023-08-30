import { Chain } from "@rainbow-me/rainbowkit";

export const fuse: Chain = {
  id: 122,
  name: "fuse",
  network: "fuse",
  iconUrl: "/fuse.svg",
  nativeCurrency: {
    decimals: 18,
    name: "FLUX",
    symbol: "FLUX",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.fuse.io"],
    },
    default: {
      http: ["https://rpc.fuse.io"],
    },
  },
  blockExplorers: {
    escan: { name: "Fuse Block Explorer", url: "https://explorer.fuse.io/" },
    default: { name: "Fuse Block Explorer", url: "https://explorer.fuse.io/" },
  },
};
