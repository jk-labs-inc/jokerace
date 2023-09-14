import { Chain } from "@rainbow-me/rainbowkit";

export const mantle: Chain = {
  id: 5000,
  name: "mantle",
  network: "mantle",
  iconUrl: "/mantle.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Mantle",
    symbol: "MNT",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.mantle.xyz/"],
    },
    default: {
      http: ["https://mantle-mainnet.public.blastapi.io/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Mantle Mainnet Scan", url: "https://explorer.mantle.xyz" },
    default: { name: "Mantle Mainnet Scan", url: "https://explorer.mantle.xyz" },
  },
};
