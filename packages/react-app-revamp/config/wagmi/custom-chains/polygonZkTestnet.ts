import { Chain } from "@rainbow-me/rainbowkit";

export const polygonZkTestnet: Chain = {
  id: 1422,
  name: "polygonZkTestnet",
  network: "polygonZkTestnet",
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
      http: [`https://polygonzkevm-testnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon zkEvm Testnet Scan", url: "https://explorer.public.zkevm-test.net/" },
    default: { name: "Polygon zkEvm Testnet Scan", url: "https://explorer.public.zkevm-test.net/" },
  },
};
