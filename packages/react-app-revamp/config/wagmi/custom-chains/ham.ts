import { Chain } from "@rainbow-me/rainbowkit";

export const ham: Chain = {
  id: 5112,
  name: "ham",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.ham.fun/"],
    },
    default: {
      http: ["https://rpc.ham.fun/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "ham Mainnet Etherscan", url: "https://explorer.ham.fun/" },
    default: { name: "ham Mainnet Etherscan", url: "https://explorer.ham.fun/" },
  },
};
