import { Chain } from "@rainbow-me/rainbowkit";

export const eos: Chain = {
  id: 17777,
  name: "eos",
  network: "eos",
  nativeCurrency: {
    decimals: 18,
    name: "EOS",
    symbol: "EOS",
  },
  rpcUrls: {
    public: {
      http: ["https://api.evm.eosnetwork.com"],
    },
    default: {
      http: ["https://api.evm.eosnetwork.com"],
    },
  },
  blockExplorers: {
    escan: { name: "EOS Mainnet Block Explorer", url: "https://explorer.evm.eosnetwork.com" },
    default: { name: "EOS Mainnet Block Explorer", url: "https://explorer.evm.eosnetwork.com" },
  },
};
