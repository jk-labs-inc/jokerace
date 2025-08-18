import { Chain } from "@rainbow-me/rainbowkit";

export const unichain: Chain = {
  id: 130,
  name: "unichain",
  iconUrl: "/unichain.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.unichain-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.unichain-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: "Unichain Mainnet Scan", url: "https://uniscan.xyz/" },
    default: { name: "Unichain Mainnet Scan", url: "https://uniscan.xyz/" },
  },
};
