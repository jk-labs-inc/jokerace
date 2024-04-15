import { Chain } from "@rainbow-me/rainbowkit";

export const xLayerTestnet: Chain = {
  id: 195,
  name: "xLayerTestnet",
  iconUrl: "/contest/mona-lisa-moustache.png",
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
    etherscan: { name: "xLayer Testnet Scan", url: "https://www.oklink.com/x1-test" },
    default: { name: "xLayer Testnet Scan", url: "https://www.oklink.com/x1-test" },
  },
  testnet: true,
};
