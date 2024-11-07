import { Chain } from "@rainbow-me/rainbowkit";

export const apechain: Chain = {
  id: 33139,
  name: "apechain",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "APE",
    symbol: "APE",
  },
  rpcUrls: {
    public: { http: ["https://apechain.calderachain.xyz/http"] },
    default: { http: ["https://apechain.calderachain.xyz/http"] },
  },
  blockExplorers: {
    etherscan: { name: "ApeChain Mainnet Scan", url: "https://apescan.org/" },
    default: { name: "ApeChain Mainnet Scan", url: "https://apescan.org/" },
  },
};
