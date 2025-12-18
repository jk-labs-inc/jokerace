import { Chain } from "@rainbow-me/rainbowkit";

export const ink: Chain = {
  id: 57073,
  name: "ink",
  iconUrl: "/ink.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: [`https://ink.drpc.org`],
    },
    default: {
      http: [
        `https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.ink-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Ink Mainnet Scan", url: "https://explorer.inkonchain.com/" },
    default: { name: "Ink Mainnet Scan", url: "https://explorer.inkonchain.com/" },
  },
};
