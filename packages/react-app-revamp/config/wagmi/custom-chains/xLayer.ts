import { Chain } from "@rainbow-me/rainbowkit";

export const xLayer: Chain = {
  id: 196,
  name: "xLayer",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "OKB",
    symbol: "OKB",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.xlayer.tech"],
    },
    default: {
      http: ["https://rpc.xlayer.tech"],
    },
  },
  blockExplorers: {
    etherscan: { name: "xLayer Scan", url: "https://www.oklink.com/xlayer" },
    default: { name: "xLayer Scan", url: "https://www.oklink.com/xlayer" },
  },
};
