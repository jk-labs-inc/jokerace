import { Chain } from "@rainbow-me/rainbowkit";

export const monad: Chain = {
  id: 143,
  name: "monad",
  iconUrl: "/monad.svg",
  nativeCurrency: {
    decimals: 18,
    name: "MON",
    symbol: "MON",
  },
  rpcUrls: {
    public: { http: [`https://rpc-mainnet.monadinfra.com`] },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.monad-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Monad Mainnet Scan", url: "https://monadscan.com/" },
    default: { name: "Monad Mainnet Scan", url: "https://monadscan.com/" },
  },
};
