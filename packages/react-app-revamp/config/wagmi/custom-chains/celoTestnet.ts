import { Chain } from "@rainbow-me/rainbowkit";

export const celoTestnet: Chain = {
  id: 44787,
  name: "celoTestnet",
  network: "celoTestnet",
  iconUrl: "/celo.svg",
  nativeCurrency: {
    decimals: 18,
    name: "A-Celo",
    symbol: "A-CELO",
  },
  rpcUrls: {
    public: {
      http: ["https://alfajores-forno.celo-testnet.org"],
    },
    default: {
      http: ["https://alfajores-forno.celo-testnet.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Celo Testnet Block Explorer", url: "https://explorer.celo.org/alfajores/" },
    default: { name: "Celo Testnet Block Explorer", url: "https://explorer.celo.org/alfajores/" },
  },
};
