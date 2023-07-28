import { Chain } from "wagmi";

export const celoTestnet = {
  id: 44787,
  name: "celoTestnet",
  network: "celoTestnet",
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
    etherscan: { name: "Celo Testnet Block Explorer", url: "https://explorer.celo.org/alfajores" },
    default: { name: "Celo Testnet Block Explorer", url: "https://explorer.celo.org/alfajores" },
  },
} as const satisfies Chain;
