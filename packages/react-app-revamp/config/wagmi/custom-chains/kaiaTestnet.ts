import { Chain } from "@rainbow-me/rainbowkit";

export const kaiaTestnet: Chain = {
  id: 8217,
  name: "kaiaTestnet",
  iconUrl: "/kaia.png",
  nativeCurrency: {
    decimals: 18,
    name: "KLAY",
    symbol: "KLAY",
  },
  rpcUrls: {
    public: {
      http: ["https://public-en.node.kaia.io/"],
    },
    default: {
      http: ["https://public-en.node.kaia.io/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Kaia Testnet Block Explorer", url: "https://klaytnscope.com/" },
    default: { name: "Kaia Testnet Block Explorer", url: "https://klaytnscope.com/" },
  },
  testnet: true,
};
