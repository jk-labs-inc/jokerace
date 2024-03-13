import { Chain } from "@rainbow-me/rainbowkit";

export const astarZkevmTestnet: Chain = {
  id: 6038361,
  name: "astarZkevmTestnet",
  iconUrl: "/astar.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.startale.com/zkyoto"],
    },
    default: {
      http: ["https://rpc.startale.com/zkyoto"],
    },
  },
  blockExplorers: {
    etherscan: { name: "AstarZkevm Testnet Etherscan", url: "https://astar-zkyoto.blockscout.com/" },
    default: { name: "AstarZkevm Testnet Etherscan", url: "https://astar-zkyoto.blockscout.com/" },
  },
  testnet: true,
};
