import { Chain } from "@rainbow-me/rainbowkit";

export const palmTestnet: Chain = {
  id: 11297108099,
  name: "palmTestnet",
  network: "palmTestnet",
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
    etherscan: { name: "Palm Testnet Scan", url: "https://www.ondora.xyz/network/palm-testnet" },
    default: { name: "Palm Testnet Scan", url: "https://www.ondora.xyz/network/palm-testnet" },
  },
  testnet: true,
};
