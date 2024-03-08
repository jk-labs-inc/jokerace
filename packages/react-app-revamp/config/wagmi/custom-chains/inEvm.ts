import { Chain } from "@rainbow-me/rainbowkit";

export const inEvm: Chain = {
  id: 2525,
  name: "inEvm",
  iconUrl: "/inEvm.png",
  nativeCurrency: {
    decimals: 18,
    name: "INJ",
    symbol: "INJ",
  },
  rpcUrls: {
    public: {
      http: ["https://mainnet.rpc.inevm.com/http"],
    },
    default: {
      http: ["https://mainnet.rpc.inevm.com/http"],
    },
  },
  blockExplorers: {
    etherscan: { name: "InEVM Mainnet Block Explorer", url: "https://explorer.inevm.com/" },
    default: { name: "InEVM Mainnet Block Explorer", url: "https://explorer.inevm.com/" },
  },
};
