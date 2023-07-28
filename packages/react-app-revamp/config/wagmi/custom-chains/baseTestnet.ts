import { Chain } from "wagmi";

export const baseTestnet = {
  id: 84531,
  name: "BaseTestnet",
  network: "baseTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://goerli.base.org"],
    },
    default: {
      http: ["https://goerli.base.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Base Testnet Scan", url: "https://goerli.basescan.org" },
    default: { name: "Base Testnet Scan", url: "https://goerli.basescan.org" },
  },
} as const satisfies Chain;
