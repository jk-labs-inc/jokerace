import { Chain } from "wagmi";

export const scrollGoerli = {
  id: 534353,
  name: "scrollGoerli",
  network: "scrollGoerli",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://alpha-rpc.scroll.io/l2"],
    },
    default: {
      http: ["https://alpha-rpc.scroll.io/l2"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Scroll Goerli Scan", url: "https://blockscout.scroll.io/" },
    default: { name: "Scroll Goerli Scan", url: "https://blockscout.scroll.io/" },
  },
} as const satisfies Chain;
