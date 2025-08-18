import { Chain } from "@rainbow-me/rainbowkit";

export const cyber: Chain = {
  id: 7560,
  name: "cyber",
  iconUrl: "/cyber.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.cyber-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.cyber-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "Cyber Block Explorer", url: "https://cyber-explorer.alt.technology/" },
    default: { name: "Cyber Block Explorer", url: "https://cyber-explorer.alt.technology/" },
  },
};
