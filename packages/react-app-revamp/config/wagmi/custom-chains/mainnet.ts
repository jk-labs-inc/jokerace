import { Chain } from "@rainbow-me/rainbowkit";

export const mainnet: Chain = {
  id: 1,
  name: "mainnet",
  iconUrl: "/mainnet.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`],
    },
    default: {
      http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}`],
    },
  },
  blockExplorers: {
    etherscan: { name: "Etherscan", url: "https://etherscan.io/" },
    default: { name: "Etherscan", url: "https://etherscan.io/" },
  },
  contracts: {
    ensRegistry: {
      address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    },
    ensUniversalResolver: {
      address: "0xeeeeeeee14d718c2b47d9923deab1335e144eeee",
      blockCreated: 16966585,
    },
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 14353601,
    },
  },
};
