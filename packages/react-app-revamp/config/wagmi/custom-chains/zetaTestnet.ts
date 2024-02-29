import { Chain } from "@rainbow-me/rainbowkit";

export const zetaTestnet: Chain = {
  id: 7001,
  name: "zetaTestnet",
  iconUrl: "/zeta.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Zeta",
    symbol: "ZETA",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.ankr.com/zetachain_evm_testnet"],
    },
    default: {
      http: ["https://rpc.ankr.com/zetachain_evm_testnet"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Zeta Block Explorer", url: "https://explorer.zetachain.com/" },
    default: { name: "Zeta Block Explorer", url: "https://explorer.zetachain.com/" },
  },
  testnet: true,
};
