import { Chain } from "@rainbow-me/rainbowkit";

export const ancient8Testnet: Chain = {
  id: 28122024,
  name: "ancient8Testnet",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpcv2-testnet.ancient8.gg/"],
    },
    default: {
      http: ["https://rpcv2-testnet.ancient8.gg/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Ancient8 Testnet Scan", url: "https://scanv2-testnet.ancient8.gg/" },
    default: { name: "Ancient8 Testnet Scan", url: "https://scanv2-testnet.ancient8.gg/" },
  },
  testnet: true,
};
