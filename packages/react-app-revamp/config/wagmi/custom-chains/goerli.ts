import { Chain } from "wagmi";

export const goerli: Chain = {
  id: 5,
  name: "goerli",
  network: "goerli",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.ankr.com/eth_goerli"],
    },
    default: {
      http: [`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Goerli Etherscan", url: "https://goerli.etherscan.io/" },
    default: { name: "Goerli Etherscan", url: "https://goerli.etherscan.io/" },
  },
};
