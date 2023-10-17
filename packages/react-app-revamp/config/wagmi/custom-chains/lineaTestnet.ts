import { Chain } from "@rainbow-me/rainbowkit";

export const lineaTestnet: Chain = {
  id: 59140,
  name: "lineaTestnet",
  network: "lineaTestnet",
  iconUrl: "/linea.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.goerli.linea.build"],
    },
    default: {
      http: ["https://rpc.goerli.linea.build"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Linea Testnet Scan", url: "https://goerli.lineascan.build/" },
    default: { name: "Linea Testnet Scan", url: "https://goerli.lineascan.build/" },
  },
  testnet: true,
};
