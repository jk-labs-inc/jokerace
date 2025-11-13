import { Chain } from "@rainbow-me/rainbowkit";

export const sonic: Chain = {
  id: 146,
  name: "sonic",
  iconUrl: "/sonic.png",
  nativeCurrency: {
    decimals: 18,
    name: "S",
    symbol: "S",
  },
  rpcUrls: {
    public: { http: [`https://rpc.soniclabs.com`] },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.sonic-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Sonic Mainnet Scan", url: "https://sonicscan.org/" },
    default: { name: "Sonic Mainnet Scan", url: "https://sonicscan.org/" },
  },
};
