import { Chain } from "wagmi";

export const gnosisMainnet: Chain = {
  id: 100,
  name: "gnosisMainnet",
  network: "gnosisMainnet",
  nativeCurrency: {
    decimals: 18,
    name: "xDAI",
    symbol: "xDAI",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.gnosischain.com/"],
    },
    default: {
      http: ["https://rpc.gnosischain.com/"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Gnosis Etherscan", url: "https://gnosisscan.io/" },
    default: { name: "Gnosis Etherscan", url: "https://gnosisscan.io/" },
  },
};
