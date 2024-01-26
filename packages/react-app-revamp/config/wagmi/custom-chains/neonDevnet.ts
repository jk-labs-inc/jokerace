import { Chain } from "wagmi/chains";

export const neonDevnet: Chain = {
  id: 245022926,
  name: "neonDevnet",
  nativeCurrency: {
    decimals: 18,
    name: "NEON",
    symbol: "NEON",
  },
  rpcUrls: {
    public: {
      http: ["https://devnet.neonevm.org"],
    },
    default: {
      http: ["https://devnet.neonevm.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Neon Devnet Scan", url: "https://devnet.neonscan.org/" },
    default: { name: "Neon Devnet Scan", url: "https://devnet.neonscan.org/" },
  },
};
