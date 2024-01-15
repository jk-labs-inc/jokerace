import { Chain } from "@rainbow-me/rainbowkit";

export const proteus: Chain = {
  id: 88002,
  name: "proteus",
  network: "proteus",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "tZBC",
    symbol: "tZBC",
  },
  rpcUrls: {
    public: {
      http: ["https://api.evm.proteus.dev.eclipsenetwork.xyz/solana"],
    },
    default: {
      http: ["https://api.evm.proteus.dev.eclipsenetwork.xyz/solana"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Proteus Etherscan", url: "https://proteus.nautscan.com/" },
    default: { name: "Proteus Etherscan", url: "https://proteus.nautscan.com/" },
  },
};
