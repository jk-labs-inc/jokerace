import { Chain } from "@rainbow-me/rainbowkit";

export const scroll: Chain = {
  id: 534352,
  name: "scroll",
  network: "scroll",
  iconUrl: "/scroll.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://mainnet-rpc.scroll.io"],
    },
    default: {
      http: ["https://mainnet-rpc.scroll.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Scroll Block Explorer", url: "https://scrollscan.com/" },
    default: { name: "Scroll Block Explorer", url: "https://scrollscan.com/" },
  },
};
