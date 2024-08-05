import { Chain } from "@rainbow-me/rainbowkit";

export const berachainBartioTestnet: Chain = {
  id: 80084,
  name: "berachainbartio",
  iconUrl: "/berachain.svg",
  nativeCurrency: {
    decimals: 18,
    name: "BERA",
    symbol: "BERA",
  },
  rpcUrls: {
    public: {
      http: ["https://bartio.rpc.berachain.com/"],
    },
    default: {
      http: ["https://bartio.rpc.berachain.com/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "berachain bArtio scan", url: "https://bartio.beratrail.io/" },
    default: { name: "berachain bArtio scan", url: "https://bartio.beratrail.io/" },
  },
  testnet: true,
};
