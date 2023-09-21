import { Chain } from "@rainbow-me/rainbowkit";

export const baseTestnet: Chain = {
  id: 84531,
  name: "baseTestnet",
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
    etherscan: { name: "Base Testnet Scan", url: "https://goerli.basescan.org/" },
    default: { name: "Base Testnet Scan", url: "https://goerli.basescan.org/" },
  },
};
