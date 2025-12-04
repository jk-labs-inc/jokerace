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
    public: { http: [`https://rpc.linea.build`] },
    default: {
      http: [
        `https://${import.meta.env.VITE_QUICKNODE_SLUG}.linea-mainnet.quiknode.pro/${import.meta.env.VITE_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Lineascan", url: "https://lineascan.build/" },
    default: { name: "Lineascan", url: "https://lineascan.build/" },
  },
};
