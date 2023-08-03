import { Chain } from "wagmi";

export const litTestnet: Chain = {
  id: 175177,
  name: "chroniclelittestnet",
  network: "chroniclelittestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Lit",
    symbol: "LIT",
  },
  rpcUrls: {
    public: {
      http: ["https://chain-rpc.litprotocol.com/http"],
    },
    default: {
      http: ["https://chain-rpc.litprotocol.com/http"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Chronicle Block Explorer", url: "https://chain.litprotocol.com/" },
    default: { name: "Chronicle Block Explorer", url: "https://chain.litprotocol.com/" },
  },
};
