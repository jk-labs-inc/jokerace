import { Chain } from "@rainbow-me/rainbowkit";

export const zksyncEra: Chain = {
  id: 324,
  name: "zksyncEra",
  iconUrl: "/zksyncEra.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [`https://zksync.drpc.org`] },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.zksync-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "ZkSync Mainnet Scan", url: "https://explorer.zksync.io/" },
    default: { name: "ZkSync Mainnet Scan", url: "https://explorer.zksync.io/" },
  },
};
