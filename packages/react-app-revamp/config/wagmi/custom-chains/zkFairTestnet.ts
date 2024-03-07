import { Chain } from "@rainbow-me/rainbowkit";

export const zkFairTestnet: Chain = {
  id: 43851,
  name: "zkFairTestnet",
  iconUrl: "/zkFair.png",
  nativeCurrency: {
    decimals: 18,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    public: {
      http: ["https://testnet-rpc.zkfair.io"],
    },
    default: {
      http: ["https://testnet-rpc.zkfair.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "ZkFair Testnet Block Explorer", url: "https://testnet-scan.zkfair.io/" },
    default: { name: "ZkFair Testnet Block Explorer", url: "https://testnet-scan.zkfair.io/" },
  },
  testnet: true,
};
