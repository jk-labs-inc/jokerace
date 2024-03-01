import { Chain } from "@rainbow-me/rainbowkit";

export const linea: Chain = {
  id: 59144,
  name: "linea",
  iconUrl: "/linea.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://linea-mainnet.infura.io/v3"],
    },
    default: {
      http: ["https://linea-mainnet.infura.io/v3"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Lineascan", url: "https://lineascan.build/" },
    default: { name: "Lineascan", url: "https://lineascan.build/" },
  },
};
