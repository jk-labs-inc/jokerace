import { Chain } from "@rainbow-me/rainbowkit";

export const movementTestnet: Chain = {
  id: 30732,
  name: "movementTestnet",
  iconUrl: "/movement.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Move",
    symbol: "MOVE",
  },
  rpcUrls: {
    public: {
      http: ["https://mevm.devnet.imola.movementlabs.xyz"],
    },
    default: {
      http: ["https://mevm.devnet.imola.movementlabs.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Movement Testnet Block Explorer", url: "https://explorer.devnet.imola.movementlabs.xyz" },
    default: { name: "Movement Testnet Block Explorer", url: "https://explorer.devnet.imola.movementlabs.xyz" },
  },
  testnet: true,
};
