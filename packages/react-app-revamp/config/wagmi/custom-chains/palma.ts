import { Chain } from "@rainbow-me/rainbowkit";

export const palma: Chain = {
  id: 11297108109,
  name: "palma",
  network: "palma",
  iconUrl: "/palm.png",
  nativeCurrency: {
    decimals: 18,
    name: "PALM",
    symbol: "PALM",
  },
  rpcUrls: {
    public: {
      http: ["https://palm-mainnet.public.blastapi.io"],
    },
    default: {
      http: ["https://palm-mainnet.public.blastapi.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Palma Mainnet Scan", url: "https://www.ondora.xyz/network/palm" },
    default: { name: "Palma Mainnet Scan", url: "https://www.ondora.xyz/network/palm" },
  },
};
