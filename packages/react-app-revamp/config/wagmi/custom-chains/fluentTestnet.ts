import { Chain } from "@rainbow-me/rainbowkit";

export const fluentTestnet: Chain = {
  id: 20993,
  name: "fluentTestnet",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.dev.gblend.xyz/"],
    },
    default: {
      http: ["https://rpc.dev.gblend.xyz/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Fluent Testnet Block Explorer", url: "https://blockscout.dev.gblend.xyz/" },
    default: { name: "Fluent Testnet Block Explorer", url: "https://blockscout.dev.gblend.xyz/" },
  },
  testnet: true,
};
