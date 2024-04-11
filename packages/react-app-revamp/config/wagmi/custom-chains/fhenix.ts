import { Chain } from "@rainbow-me/rainbowkit";

export const fhenixTestnet: Chain = {
  id: 42069,
  name: "fhenixTestnet",
  iconUrl: "/fhenix.svg",
  nativeCurrency: {
    decimals: 18,
    name: "tFHE",
    symbol: "tFHE",
  },
  rpcUrls: {
    public: { http: ["https://api.testnet.fhenix.zone:7747/"] },
    default: { http: [`https://api.testnet.fhenix.zone:7747/`] },
  },
  blockExplorers: {
    etherscan: { name: "Fhenix Testnet scan", url: "https://explorer.testnet.fhenix.zone/" },
    default: { name: "Fhenix Testnet scan", url: "https://explorer.testnet.fhenix.zone/" },
  },
  testnet: true,
};
