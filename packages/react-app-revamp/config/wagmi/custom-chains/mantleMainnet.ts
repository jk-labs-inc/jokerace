import { Chain } from "@rainbow-me/rainbowkit";

export const mantleMainnet: Chain = {
  id: 5000,
  name: "mantleMainnet",
  network: "mantleMainnet",
  iconUrl: "/mantle.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Mantle",
    symbol: "MNT",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.mantle.xyz"],
    },
    default: {
      http: ["https://rpc.mantle.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Mantle Mainnet Scan", url: "https://explorer.mantle.xyz" },
    default: { name: "Mantle Mainnet Scan", url: "https://explorer.mantle.xyz" },
  },
};
