import { Chain } from "@rainbow-me/rainbowkit";

export const zircuit: Chain = {
  id: 48900,
  name: "zircuit",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "ZRC",
    symbol: "ZRC",
  },
  rpcUrls: {
    public: { http: ["https://zircuit-mainnet.drpc.org"] },
    default: { http: ["https://zircuit-mainnet.drpc.org"] },
  },
  blockExplorers: {
    etherscan: { name: "Zircuit Mainnet Scan", url: "https://explorer.zircuit.com/" },
    default: { name: "Zircuit Mainnet Scan", url: "https://explorer.zircuit.com/" },
  },
};
