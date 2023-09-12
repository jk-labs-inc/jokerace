import { Chain } from "@rainbow-me/rainbowkit";

export const polygonZkTestnet: Chain = {
  id: 1422,
  name: "polygonZkTestnet",
  network: "polygonZkTestnet",
  iconUrl: "/polygon.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.public.zkevm-test.net"],
    },
    default: {
      http: ["https://rpc.public.zkevm-test.net"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Polygon zkEvm Testnet Scan", url: "https://testnet-zkevm.polygonscan.com" },
    default: { name: "Polygon zkEvm Testnet Scan", url: "https://testnet-zkevm.polygonscan.com" },
  },
};
