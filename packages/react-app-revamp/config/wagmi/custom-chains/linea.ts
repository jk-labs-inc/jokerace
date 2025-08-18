import { Chain } from "@rainbow-me/rainbowkit";

export const linea: Chain = {
  id: 59144,
  name: "linea",
  iconUrl: "/linea.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.linea-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.linea-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "Lineascan", url: "https://lineascan.build/" },
    default: { name: "Lineascan", url: "https://lineascan.build/" },
  },
};
