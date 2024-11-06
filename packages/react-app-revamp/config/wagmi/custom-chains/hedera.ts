import { Chain } from "@rainbow-me/rainbowkit";

export const hedera: Chain = {
  id: 295,
  name: "hedera",
  iconUrl: "/hedera.svg",
  nativeCurrency: {
    decimals: 18,
    name: "HBAR",
    symbol: "HBAR",
  },
  rpcUrls: {
    public: {
      http: ["https://295.rpc.thirdweb.com"],
    },
    default: {
      http: ["https://295.rpc.thirdweb.com"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Hedera Mainnet Etherscan", url: "https://hashscan.io/mainnet/" },
    default: { name: "Hedera Mainnet Etherscan", url: "https://hashscan.io/mainnet/" },
  },
};
