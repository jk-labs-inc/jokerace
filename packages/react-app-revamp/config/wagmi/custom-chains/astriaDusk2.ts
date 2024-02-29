import { Chain } from "@rainbow-me/rainbowkit";

export const astriaDusk2: Chain = {
  id: 912559,
  name: "astriaDusk2",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "RIA",
    symbol: "RIA",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.evm.dusk-2.devnet.astria.org/"],
    },
    default: {
      http: ["https://rpc.evm.dusk-2.devnet.astria.org/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Astria Dusk 2 Block Explorer", url: "https://explorer.evm.dusk-2.devnet.astria.org/" },
    default: { name: "Astria Dusk 2 Block Explorer", url: "https://explorer.evm.dusk-2.devnet.astria.org/" },
  },
};
