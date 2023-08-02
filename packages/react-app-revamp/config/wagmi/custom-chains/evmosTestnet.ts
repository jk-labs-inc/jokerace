import { Chain } from "wagmi";

export const evmosTestnet: Chain = {
  id: 9000,
  name: "EvmosTestnet",
  network: "evmosTestnet",
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
    mintscan: { name: "Mintscan", url: "https://testnet.mintscan.io/evmos-testnet" },
    default: { name: "Mintscan", url: "https://testnet.mintscan.io/evmos-testnet" },
  },
};
