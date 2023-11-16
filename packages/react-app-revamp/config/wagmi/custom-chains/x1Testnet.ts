import { Chain } from "@rainbow-me/rainbowkit";

export const x1Testnet: Chain = {
  id: 195,
  name: "x1Testnet",
  network: "x1Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "OKB",
    symbol: "OKB",
  },
  rpcUrls: {
    public: {
      http: ["https://testrpc.x1.tech"],
    },
    default: {
      http: ["https://testrpc.x1.tech"],
    },
  },
  blockExplorers: {
    etherscan: { name: "x1 Testnet Scan", url: "https://www.oklink.com/x1-test" },
    default: { name: "x1 Testnet Scan", url: "https://www.oklink.com/x1-test" },
  },
  testnet: true,
};
