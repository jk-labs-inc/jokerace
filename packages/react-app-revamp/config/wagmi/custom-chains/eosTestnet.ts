import { Chain } from "@rainbow-me/rainbowkit";

export const eosTestnet: Chain = {
  id: 15557,
  name: "eosTestnet",
  network: "eosTestnet",
  iconUrl: "/eos.svg",
  nativeCurrency: {
    decimals: 18,
    name: "EOS",
    symbol: "EOS",
  },
  rpcUrls: {
    public: {
      http: ["https://api.testnet.evm.eosnetwork.com"],
    },
    default: {
      http: ["https://api.testnet.evm.eosnetwork.com"],
    },
  },
  blockExplorers: {
    escan: { name: "EOS Testnet Block Explorer", url: "https://explorer.testnet.evm.eosnetwork.com" },
    default: { name: "EOS Testnet Block Explorer", url: "https://explorer.testnet.evm.eosnetwork.com" },
  },
};
