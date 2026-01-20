import { ChainWithIcon } from "./types";

export const kub: ChainWithIcon = {
  id: 96,
  name: "kub",
  iconUrl: "/kub.svg",
  nativeCurrency: {
    decimals: 18,
    name: "KUB",
    symbol: "KUB",
  },
  rpcUrls: {
    public: { http: [`https://rpc.bitkubchain.io/`] },
    default: { http: [`https://rpc.bitkubchain.io/`] },
  },
  blockExplorers: {
    etherscan: { name: "Kub Mainnet Scan", url: "https://kubscan.com/" },
    default: { name: "Kub Mainnet Scan", url: "https://kubscan.com/" },
  },
};
