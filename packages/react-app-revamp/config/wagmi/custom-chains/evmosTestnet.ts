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
      http: ["https://jsonrpc-t.evmos.nodestake.top"],
    },
    default: {
      http: ["https://jsonrpc-t.evmos.nodestake.top"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Mintscan", url: "https://testnet.mintscan.io/evmos-testnet/" },
    default: { name: "Mintscan", url: "https://testnet.mintscan.io/evmos-testnet/" },
  },
  testnet: true,
};
