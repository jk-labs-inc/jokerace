import { Chain } from "@rainbow-me/rainbowkit";

export const seiTestnet: Chain = {
  id: 1328,
  name: "seiTestnet",
  iconUrl: "/seiTestnet.png",
  nativeCurrency: {
    decimals: 18,
    name: "Sei",
    symbol: "SEI",
  },
  rpcUrls: {
    public: {
      http: ["https://evm-rpc-testnet.sei-apis.com/"],
    },
    default: {
      http: ["https://evm-rpc-testnet.sei-apis.com/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Sei Block Explorer", url: "https://seiTestnettrace.com/" },
    default: { name: "Sei Block Explorer", url: "https://seiTestnettrace.com/" },
  },
};
