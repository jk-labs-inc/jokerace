import { Chain } from "@rainbow-me/rainbowkit";

export const zeta: Chain = {
  id: 7000,
  name: "zeta",
  iconUrl: "/zeta.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Zeta",
    symbol: "ZETA",
  },
  rpcUrls: {
    public: {
      http: ["https://zetachain-evm.blockpi.network/v1/rpc/public"],
    },
    default: {
      http: ["https://zetachain-evm.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Zeta Block Explorer", url: "https://explorer.zetachain.com/" },
    default: { name: "Zeta Block Explorer", url: "https://explorer.zetachain.com/" },
  },
  testnet: true,
};
