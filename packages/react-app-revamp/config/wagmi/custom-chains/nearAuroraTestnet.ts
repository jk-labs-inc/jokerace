import { Chain } from "wagmi";

export const nearAuroraTestnet: Chain = {
  id: 1313161555,
  name: "nearAuroraTestnet",
  network: "nearAuroraTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://testnet.aurora.dev"],
    },
    default: {
      http: ["https://testnet.aurora.dev"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Near Aurora Testnet Block Explorer", url: "https://testnet.aurorascan.dev/" },
    default: { name: "Near Aurora Testnet Block Explorer", url: "https://testnet.aurorascan.dev/" },
  },
};
