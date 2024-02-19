import { Chain } from "@rainbow-me/rainbowkit";

export const scrollTestnet: Chain = {
  id: 534353,
  name: "scrollTestnet",
  iconUrl: "/scroll.svg",
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
  testnet: true,
};
