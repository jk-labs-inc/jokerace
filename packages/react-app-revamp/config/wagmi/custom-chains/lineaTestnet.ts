import { Chain } from "@rainbow-me/rainbowkit";

export const lineaTestnet: Chain = {
  id: 59140,
  name: "lineaTestnet",
  iconUrl: "/linea.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.sepolia.linea.build"],
    },
    default: {
      http: ["https://rpc.sepolia.linea.build"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Linea Testnet Scan", url: "https://sepolia.lineascan.build/" },
    default: { name: "Linea Testnet Scan", url: "https://sepolia.lineascan.build/" },
  },
  testnet: true,
};
