import { Chain } from "@rainbow-me/rainbowkit";

export const celo: Chain = {
  id: 42220,
  name: "celo",
  iconUrl: "/celo.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Celo",
    symbol: "CELO",
  },
  rpcUrls: {
    public: {
      http: ["https://forno.celo.org"],
    },
    default: {
      http: ["https://forno.celo.org"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Celo Block Explorer", url: "https://celoscan.io/" },
    default: { name: "Celo Block Explorer", url: "https://celoscan.io/" },
  },
};
