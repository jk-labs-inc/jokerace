import { Chain } from "@rainbow-me/rainbowkit";

export const gnosis: Chain = {
  id: 100,
  name: "gnosis",
  iconUrl: "/gnosis.png",
  nativeCurrency: {
    decimals: 18,
    name: "xDAI",
    symbol: "xDAI",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.ankr.com/gnosis"],
    },
    default: {
      http: ["https://rpc.ankr.com/gnosis"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Gnosis Etherscan", url: "https://gnosisscan.io/" },
    default: { name: "Gnosis Etherscan", url: "https://gnosisscan.io/" },
  },
};
