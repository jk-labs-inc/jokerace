import { Chain } from "@rainbow-me/rainbowkit";

export const merlin: Chain = {
  id: 4200,
  name: "merlin",
  iconUrl: "/merlin.png",
  nativeCurrency: {
    decimals: 18,
    name: "BTC",
    symbol: "BTC",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.merlinchain.io"],
    },
    default: {
      http: ["https://rpc.merlinchain.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Merlin Mainnet Scan", url: "https://scan.merlinchain.io/" },
    default: { name: "Merlin Mainnet Scan", url: "https://scan.merlinchain.io/" },
  },
};
