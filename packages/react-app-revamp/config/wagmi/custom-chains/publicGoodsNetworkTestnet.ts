import { Chain } from "wagmi";

export const publicGoodsNetworkTestnet = {
  id: 58008,
  name: "publicGoodsNetworkTestnet",
  network: "publicGoodsNetworkTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://sepolia.publicgoods.network"],
    },
    default: {
      http: ["https://sepolia.publicgoods.network"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Public Goods Network Testnet Block Explorer",
      url: "https://explorer.sepolia.publicgoods.network/",
    },
    default: {
      name: "Public Goods Network Testnet Block Explorer",
      url: "https://explorer.sepolia.publicgoods.network/",
    },
  },
} as const satisfies Chain;
