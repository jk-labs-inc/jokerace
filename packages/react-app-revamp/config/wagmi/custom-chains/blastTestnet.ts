import { Chain } from "@rainbow-me/rainbowkit";

export const blastTestnet: Chain = {
  id: 168587773,
  name: "blastTestnet",
  network: "blastTestnet",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://sepolia.blast.io"],
    },
    default: {
      http: ["https://sepolia.blast.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Blast Testnet Scan", url: "https://testnet.blastscan.io/" },
    default: { name: "Blast Testnet Scan", url: "https://testnet.blastscan.io/" },
  },
  testnet: true,
};
