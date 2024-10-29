import { Chain } from "@rainbow-me/rainbowkit";

export const campTestnet: Chain = {
  id: 325000,
  name: "campTestnet",
  iconUrl: "/camp.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc-campnetwork.xyz/"],
    },
    default: {
      http: ["https://rpc-campnetwork.xyz/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Camp Testnet Block Explorer", url: "https://camp-network-testnet.blockscout.com/" },
    default: { name: "Camp Testnet Block Explorer", url: "https://camp-network-testnet.blockscout.com/" },
  },
  testnet: true,
};
