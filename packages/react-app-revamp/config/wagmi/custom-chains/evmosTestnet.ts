import { Chain } from "@rainbow-me/rainbowkit";

export const evmosTestnet: Chain = {
  id: 9000,
  name: "evmosTestnet",
  network: "evmosTestnet",
  iconUrl: "/evmos.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Testnet Evmos",
    symbol: "tEVMOS",
  },
  rpcUrls: {
    public: {
      http: ["https://eth.bd.evmos.dev:8545"],
    },
    default: {
      http: ["https://eth.bd.evmos.dev:8545"],
    },
  },
  blockExplorers: {
    mintscan: { name: "Mintscan", url: "https://testnet.mintscan.io/evmos-testnet/" },
    default: { name: "Mintscan", url: "https://testnet.mintscan.io/evmos-testnet/" },
  },
};
