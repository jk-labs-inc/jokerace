import { Chain } from "@rainbow-me/rainbowkit";

export const manta: Chain = {
  id: 169,
  name: "manta",
  iconUrl: "/manta.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://pacific-rpc.manta.network/http"] },
    default: { http: ["https://pacific-rpc.manta.network/http"] },
  },
  blockExplorers: {
    etherscan: { name: "Manta Mainnet Scan", url: "https://pacific-explorer.manta.network/" },
    default: { name: "Manta Mainnet Scan", url: "https://pacific-explorer.manta.network/" },
  },
};
