import { Chain } from "@rainbow-me/rainbowkit";

export const soneium: Chain = {
  id: 1868,
  name: "soneium",
  iconUrl: "/soneium.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://soneium.drpc.org`] },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.soneium-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Soneium Mainnet Scan", url: "https://soneium.blockscout.com/" },
    default: { name: "Soneium Mainnet Scan", url: "https://soneium.blockscout.com/" },
  },
};
