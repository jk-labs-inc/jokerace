import { Chain } from "@rainbow-me/rainbowkit";

export const fhenixHeliumTestnet: Chain = {
  id: 8008135,
  name: "fhenixHeliumTestnet",
  iconUrl: "/fhenix.svg",
  nativeCurrency: {
    decimals: 18,
    name: "tFHE",
    symbol: "tFHE",
  },
  rpcUrls: {
    public: { http: ["https://api.helium.fhenix.zone"] },
    default: { http: [`https://api.helium.fhenix.zone`] },
  },
  blockExplorers: {
    etherscan: { name: "Fhenix Helium Testnet scan", url: "https://explorer.helium.fhenix.zone/" },
    default: { name: "Fhenix Helium Testnet scan", url: "https://explorer.helium.fhenix.zone/" },
  },
  testnet: true,
};
