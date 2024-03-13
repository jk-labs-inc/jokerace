import { Chain } from "@rainbow-me/rainbowkit";

export const zkFair: Chain = {
  id: 42766,
  name: "zkFair",
  iconUrl: "/zkFair.png",
  nativeCurrency: {
    decimals: 18,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.zkfair.io"],
    },
    default: {
      http: ["https://rpc.zkfair.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "ZkFair Mainnet Block Explorer", url: "https://scan.zkfair.io/" },
    default: { name: "ZkFair Mainnet Block Explorer", url: "https://scan.zkfair.io/" },
  },
};
