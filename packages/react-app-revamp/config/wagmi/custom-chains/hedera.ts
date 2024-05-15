import { Chain } from "@rainbow-me/rainbowkit";

export const hedera: Chain = {
  id: 295,
  name: "hedera",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "HBAR",
    symbol: "HBAR",
  },
  rpcUrls: {
    public: {
      http: ["https://mainnet.hashio.io/api"],
    },
    default: {
      http: ["https://mainnet.hashio.io/api"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Hedera Mainnet Etherscan", url: "https://hashscan.io/mainnet/" },
    default: { name: "Hedera Mainnet Etherscan", url: "https://hashscan.io/mainnet/" },
  },
};
