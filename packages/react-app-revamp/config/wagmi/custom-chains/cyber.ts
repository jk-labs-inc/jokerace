import { Chain } from "@rainbow-me/rainbowkit";

export const cyber: Chain = {
  id: 7560,
  name: "cyber",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://cyber.alt.technology/"],
    },
    default: {
      http: ["https://cyber.alt.technology/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Cyber Block Explorer", url: "https://cyber-explorer.alt.technology/" },
    default: { name: "Cyber Block Explorer", url: "https://cyber-explorer.alt.technology/" },
  },
};
