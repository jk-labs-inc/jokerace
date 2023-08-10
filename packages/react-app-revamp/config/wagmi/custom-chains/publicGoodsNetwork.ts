import { Chain } from "@rainbow-me/rainbowkit";

export const publicGoodsNetwork: Chain = {
  id: 424,
  name: "publicGoodsNetwork",
  network: "publicGoodsNetwork",
  iconUrl: "/publicgoodsnetwork.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.publicgoods.network"],
    },
    default: {
      http: ["https://rpc.publicgoods.network"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Public Goods Network Mainnet Block Explorer", url: "https://explorer.publicgoods.network/" },
    default: { name: "Public Goods Network Mainnet Block Explorer", url: "https://explorer.publicgoods.network/" },
  },
};
