import { Chain } from "wagmi";

export const mantleMainnet = {
  id: 5000,
  name: "mantleMainnet",
  network: "mantleMainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Mantle",
    symbol: "MNT",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.mantle.xyz"],
    },
    default: {
      http: ["https://rpc.mantle.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Mantle Mainnet Scan", url: "https://explorer.mantle.xyz" },
    default: { name: "Mantle Mainnet Scan", url: "https://explorer.mantle.xyz" },
  },
} as const satisfies Chain;
