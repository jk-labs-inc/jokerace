import { Chain } from "@rainbow-me/rainbowkit";

export const publicGoodsNetworkTestnet: Chain = {
  id: 58008,
  name: "publicGoodsNetworkTestnet",
  network: "publicGoodsNetworkTestnet",
  iconUrl: "/publicgoodsnetwork.svg",
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
};
