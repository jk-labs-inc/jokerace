import { Chain } from "@rainbow-me/rainbowkit";

export const lyra: Chain = {
  id: 957,
  name: "lyra",
  network: "lyra",
  iconUrl: "/lyra.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.lyra.finance"],
    },
    default: {
      http: ["https://rpc.lyra.finance"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Lyra Mainnet Block Explorer", url: "https://explorer.lyra.finance/" },
    default: { name: "Lyra Mainnet Block Explorer", url: "https://explorer.lyra.finance/" },
  },
};
