import { Chain } from "@rainbow-me/rainbowkit";

export const sei: Chain = {
  id: 713715,
  name: "sei",
  iconUrl: "/sei.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://evm-rpc-arctic-1.sei-apis.com"],
    },
    default: {
      http: ["https://evm-rpc-arctic-1.sei-apis.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Sei Block Explorer", url: "https://seitrace.com/" },
    default: { name: "Sei Block Explorer", url: "https://seitrace.com/" },
  },
};
