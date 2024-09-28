import { Chain } from "@rainbow-me/rainbowkit";

export const polygonZkTestnet: Chain = {
  id: 1422,
  name: "polygonZkTestnet",
  iconUrl: "/polygon.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.public.zkevm-test.net"],
    },
    default: {
      http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.zkevm-cardona.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon zkEvm Testnet Scan", url: "https://explorer.public.zkevm-test.net/" },
    default: { name: "Polygon zkEvm Testnet Scan", url: "https://explorer.public.zkevm-test.net/" },
  },
  testnet: true,
};
