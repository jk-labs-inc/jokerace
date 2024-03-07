import { Chain } from "@rainbow-me/rainbowkit";

export const merlinTestnet: Chain = {
  id: 686868,
  name: "merlinTestnet",
  iconUrl: "/merlin.png",
  nativeCurrency: {
    decimals: 18,
    name: "BTC",
    symbol: "BTC",
  },
  rpcUrls: {
    public: {
      http: ["https://testnet-rpc.merlinchain.io"],
    },
    default: {
      http: ["https://testnet-rpc.merlinchain.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Merlin Testnet Scan", url: "https://testnet-scan.merlinchain.io/" },
    default: { name: "Merlin Testnet Scan", url: "https://testnet-scan.merlinchain.io/" },
  },
  testnet: true,
};
