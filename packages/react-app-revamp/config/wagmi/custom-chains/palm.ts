import { Chain } from "@rainbow-me/rainbowkit";

export const palm: Chain = {
  id: 11297108109,
  name: "palm",
  network: "palm",
  iconUrl: "/palm.png",
  nativeCurrency: {
    decimals: 18,
    name: "PALM",
    symbol: "PALM",
  },
  rpcUrls: {
    public: {
      http: ["https://palm-mainnet.public.blastapi.io"],
    },
    default: {
      http: ["https://palm-mainnet.public.blastapi.io"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Palm Mainnet Scan", url: "https://www.ondora.xyz/network/palm" },
    default: { name: "Palm Mainnet Scan", url: "https://www.ondora.xyz/network/palm" },
  },
};
