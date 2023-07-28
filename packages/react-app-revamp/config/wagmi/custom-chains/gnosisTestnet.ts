import { Chain } from "wagmi";

export const gnosisTestnet = {
  id: 10200,
  name: "gnosisTestnet",
  network: "gnosisTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "xDAI",
    symbol: "xDAI",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.chiadochain.net"],
    },
    default: {
      http: ["https://rpc.chiadochain.net"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Gnosis Testnet Etherscan", url: "https://gnosis-chiado.blockscout.com/" },
    default: { name: "Gnosis Testnet Etherscan", url: "https://gnosis-chiado.blockscout.com/" },
  },
} as const satisfies Chain;
