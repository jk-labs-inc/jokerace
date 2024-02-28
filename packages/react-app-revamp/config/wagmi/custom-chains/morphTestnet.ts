import { Chain } from "@rainbow-me/rainbowkit";

export const morphTestnet: Chain = {
  id: 2710,
  name: "morphTestnet",
  iconUrl: "/morph.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc-testnet.morphl2.io/"],
    },
    default: {
      http: ["https://rpc-testnet.morphl2.io/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Morph Mainnet Scan ", url: "https://explorer-testnet.morphl2.io/" },
    default: { name: "Morph Mainnet Scan", url: "https://explorer-testnet.morphl2.io/" },
  },
  testnet: true,
};
