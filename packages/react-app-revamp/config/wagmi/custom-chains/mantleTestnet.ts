import { Chain } from "wagmi";

export const mantleTestnet = {
  id: 5001,
  name: "mantleTestnet",
  network: "mantleTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Mantle",
    symbol: "MNT",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
    default: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Mantle Testnet Scan", url: "https://explorer.testnet.mantle.xyz" },
    default: { name: "Mantle Testnet Scan", url: "https://explorer.testnet.mantle.xyz" },
  },
} as const satisfies Chain;
