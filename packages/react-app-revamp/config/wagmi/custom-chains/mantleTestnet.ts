import { Chain } from "@rainbow-me/rainbowkit";

export const mantleTestnet: Chain = {
  id: 5001,
  name: "mantleTestnet",
  network: "mantleTestnet",
  iconUrl: "/mantle.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Mantle",
    symbol: "MNT",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
    default: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Mantle Testnet Scan", url: "https://explorer.testnet.mantle.xyz/" },
    default: { name: "Mantle Testnet Scan", url: "https://explorer.testnet.mantle.xyz/" },
  },
  testnet: true,
};
