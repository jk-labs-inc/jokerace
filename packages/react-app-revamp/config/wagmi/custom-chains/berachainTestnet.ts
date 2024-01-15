import { Chain } from "@rainbow-me/rainbowkit";

export const berachainTestnet: Chain = {
  id: 80085,
  name: "berachainTestnet",
  network: "berachainTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "BERA",
    symbol: "BERA",
  },
  rpcUrls: {
    public: {
      http: ["https://artio.rpc.berachain.com/"],
    },
    default: {
      http: ["https://artio.rpc.berachain.com/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Berachain Testnet Scan", url: "https://artio.beratrail.io/" },
    default: { name: "Berachain Testnet Scan", url: "https://artio.beratrail.io/" },
  },
  testnet: true,
};
