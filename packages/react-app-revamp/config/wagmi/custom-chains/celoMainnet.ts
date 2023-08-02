import { Chain } from "wagmi";

export const celoMainnet: Chain = {
  id: 42220,
  name: "celoMainnet",
  network: "celoMainnet",
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
    etherscan: { name: "Celo Block Explorer", url: "https://celoscan.io" },
    default: { name: "Celo Block Explorer", url: "https://celoscan.io" },
  },
};
