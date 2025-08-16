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
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.xdai.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.xdai.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "Gnosis Etherscan", url: "https://gnosisscan.io/" },
    default: { name: "Gnosis Etherscan", url: "https://gnosisscan.io/" },
  },
};
