import { Chain } from "@rainbow-me/rainbowkit";

export const eos: Chain = {
  id: 17777,
  name: "eos",
  network: "eos",
  iconUrl: "/eos.svg",
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
    etherscan: { name: "EOS Mainnet Block Explorer", url: "https://explorer.evm.eosnetwork.com/" },
    default: { name: "EOS Mainnet Block Explorer", url: "https://explorer.evm.eosnetwork.com/" },
  },
};
