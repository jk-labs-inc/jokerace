import { Chain } from "@rainbow-me/rainbowkit";

export const zora: Chain = {
  id: 7777777,
  name: "zora",
  iconUrl: "/zora.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.zora.energy/"],
    },
    default: {
      http: ["https://rpc.zora.energy/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Zora Block Explorer", url: "https://explorer.zora.energy/" },
    default: { name: "Zora Block Explorer", url: "https://explorer.zora.energy/" },
  },
};
