import { Chain } from "@rainbow-me/rainbowkit";

export const zksyncEra: Chain = {
  id: 324,
  name: "zksyncEra",
  iconUrl: "/zksyncEra.png",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://mainnet.era.zksync.io"] },
    default: { http: ["https://mainnet.era.zksync.io"] },
  },
  blockExplorers: {
    etherscan: { name: "ZkSync Mainnet Scan", url: "https://explorer.zksync.io/" },
    default: { name: "ZkSync Mainnet Scan", url: "https://explorer.zksync.io/" },
  },
};
