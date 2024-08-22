import { Chain } from "@rainbow-me/rainbowkit";

export const weavevmTestnet: Chain = {
  id: 9496,
  name: "WeaveVM",
  iconUrl: "/wvm.png",
  nativeCurrency: {
    decimals: 18,
    name: "tWVM",
    symbol: "tWVM",
  },
  rpcUrls: {
    public: {
      http: ["https://testnet-rpc.wvm.dev"],
    },
    default: {
      http: ["https://testnet-rpc.wvm.dev"],
    },
  },
  blockExplorers: {
    etherscan: { name: "WeaveVM Block Explorer", url: "https://explorer.wvm.dev" },
    default: { name: "WeaveVM Block Explorer", url: "https://explorer.wvm.dev" },
  },
  testnet: true,
};
