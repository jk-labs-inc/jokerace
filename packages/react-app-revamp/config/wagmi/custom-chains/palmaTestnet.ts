import { Chain } from "@rainbow-me/rainbowkit";

export const palmaTestnet: Chain = {
  id: 11297108099,
  name: "palmaTestnet",
  network: "palmaTestnet",
  iconUrl: "/palm.png",
  nativeCurrency: {
    decimals: 18,
    name: "PALM",
    symbol: "PALM",
  },
  rpcUrls: {
    public: {
      http: ["https://palm-testnet.public.blastapi.io"],
    },
    default: {
      http: ["https://palm-testnet.public.blastapi.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Palma Testnet Scan", url: "https://www.ondora.xyz/network/palm-testnet" },
    default: { name: "Palma Testnet Scan", url: "https://www.ondora.xyz/network/palm-testnet" },
  },
  testnet: true,
};
