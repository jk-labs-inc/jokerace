import { Chain } from "@rainbow-me/rainbowkit";

export const syndicateFrame: Chain = {
  id: 5101,
  name: "syndicateFrame",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc-frame.syndicate.io"],
    },
    default: {
      http: ["https://rpc-frame.syndicate.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Syndicate Frame Block Explorer", url: "https://explorer-frame.syndicate.io/" },
    default: { name: "Syndicate Frame Block Explorer", url: "https://explorer-frame.syndicate.io/" },
  },
};
