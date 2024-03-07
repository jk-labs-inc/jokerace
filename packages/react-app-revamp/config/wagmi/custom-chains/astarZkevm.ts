import { Chain } from "@rainbow-me/rainbowkit";

export const astarZkevm: Chain = {
  id: 3776,
  name: "astarZkevm",
  iconUrl: "/astar.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.startale.com/astar-zkevm"],
    },
    default: {
      http: ["https://rpc.startale.com/astar-zkevm"],
    },
  },
  blockExplorers: {
    etherscan: { name: "AstarZkevm Mainnet Etherscan", url: "https://astar-zkevm.explorer.startale.com/" },
    default: { name: "AstarZkevm Mainnet Etherscan", url: "https://astar-zkevm.explorer.startale.com/" },
  },
};
