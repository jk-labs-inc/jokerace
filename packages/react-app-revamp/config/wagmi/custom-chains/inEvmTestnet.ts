import { Chain } from "@rainbow-me/rainbowkit";

export const inEvmTestnet: Chain = {
  id: 2424,
  name: "inEvmTestnet",
  iconUrl: "/inEvm.png",
  nativeCurrency: {
    decimals: 18,
    name: "INJ",
    symbol: "INJ",
  },
  rpcUrls: {
    public: {
      http: ["https://testnet.rpc.inevm.com/http"],
    },
    default: {
      http: ["https://testnet.rpc.inevm.com/http"],
    },
  },
  blockExplorers: {
    etherscan: { name: "InEVM Testnet Block Explorer", url: "https://testnet.explorer.inevm.com/" },
    default: { name: "InEVM Testnet Block Explorer", url: "https://testnet.explorer.inevm.com/" },
  },
  testnet: true,
};
