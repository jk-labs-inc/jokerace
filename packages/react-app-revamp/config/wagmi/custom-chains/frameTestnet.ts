import { Chain } from "@rainbow-me/rainbowkit";

export const frameTestnet: Chain = {
  id: 68840142,
  name: "frameTestnet",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.testnet.frame.xyz/http"],
    },
    default: {
      http: ["https://rpc.testnet.frame.xyz/http"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Frame Testnet Block Explorer", url: "https://explorer.testnet.frame.xyz/" },
    default: { name: "Frame Testnet Block Explorer", url: "https://explorer.testnet.frame.xyz/" },
  },
  testnet: true,
};
