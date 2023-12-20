import { Chain } from "@rainbow-me/rainbowkit";

export const fantomTestnet: Chain = {
  id: 4002,
  name: "fantomTestnet",
  network: "fantomTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "FTM",
    symbol: "FTM",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.testnet.fantom.network/"],
    },
    default: {
      http: ["https://rpc.testnet.fantom.network/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Fantom Testnet Block Explorer", url: "https://testnet.ftmscan.com/" },
    default: { name: "Fantom Testnet Block Explorer", url: "https://testnet.ftmscan.com/" },
  },
  testnet: true,
};
