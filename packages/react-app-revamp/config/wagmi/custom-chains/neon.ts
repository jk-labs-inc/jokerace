import { Chain } from "@rainbow-me/rainbowkit";

export const neon: Chain = {
  id: 245022934,
  name: "neon",
  iconUrl: "/neon.png",
  nativeCurrency: {
    decimals: 18,
    name: "NEON",
    symbol: "NEON",
  },
  rpcUrls: {
    public: {
      http: ["https://neon-proxy-mainnet.solana.p2p.org"],
    },
    default: {
      http: ["https://neon-proxy-mainnet.solana.p2p.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Neon Mainnet Scan", url: "https://neonscan.org/" },
    default: { name: "Neon Mainnet Scan", url: "https://neonscan.org/" },
  },
};
