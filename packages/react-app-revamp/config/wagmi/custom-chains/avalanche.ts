import { ChainWithIcon } from "./types";

export const avalanche: ChainWithIcon = {
  id: 43114,
  name: "avalanche",
  iconUrl: "/avalanche.svg",
  nativeCurrency: {
    decimals: 18,
    name: "AVAX",
    symbol: "AVAX",
  },
  rpcUrls: {
    public: { http: [`https://api.avax.network/ext/bc/C/rpc`] },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.avalanche-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}/ext/bc/C/rpc`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Snowtrace", url: "https://snowscan.xyz/" },
    default: { name: "Snowtrace", url: "https://snowscan.xyz/" },
  },
};
