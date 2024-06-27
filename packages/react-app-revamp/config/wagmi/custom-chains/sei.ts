import { Chain } from "@rainbow-me/rainbowkit";

export const sei: Chain = {
  id: 1329,
  name: "sei",
  iconUrl: "/sei.png",
  nativeCurrency: {
    decimals: 18,
    name: "Sei",
    symbol: "SEI",
  },
  rpcUrls: {
    public: {
      http: ["https://evm-rpc.sei-apis.com"],
    },
    default: {
      http: ["https://evm-rpc.sei-apis.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Sei Block Explorer", url: "https://seitrace.com/" },
    default: { name: "Sei Block Explorer", url: "https://seitrace.com/" },
  },
};
