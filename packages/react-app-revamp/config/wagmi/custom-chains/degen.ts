import { Chain } from "@rainbow-me/rainbowkit";

export const degen: Chain = {
  id: 666666666,
  name: "degen",
  iconUrl: "/degen.png",
  nativeCurrency: {
    decimals: 18,
    name: "Degen",
    symbol: "DEGEN",
  },
  rpcUrls: {
    public: {
      http: ["https://nitrorpc-degen-mainnet-1.t.conduit.xyz"],
    },
    default: {
      http: ["https://nitrorpc-degen-mainnet-1.t.conduit.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Degen Block Explorer", url: "https://explorer.degen.tips/" },
    default: { name: "Degen Block Explorer", url: "https://explorer.degen.tips/" },
  },
};
