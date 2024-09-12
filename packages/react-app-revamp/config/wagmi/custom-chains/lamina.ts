import { Chain } from "@rainbow-me/rainbowkit";

export const lamina: Chain = {
  id: 10849,
  name: "lamina",
  iconUrl: "/lamina.png",
  nativeCurrency: {
    decimals: 18,
    name: "L1",
    symbol: "L1",
  },
  rpcUrls: {
    public: { http: ["https://subnets.avax.network/lamina1/mainnet/rpc"] },
    default: { http: ["https://subnets.avax.network/lamina1/mainnet/rpc"] },
  },
  blockExplorers: {
    etherscan: { name: "Lamina Mainnet Scan", url: "https://explorer.lamina1.com/" },
    default: { name: "Lamina Mainnet Scan", url: "https://explorer.lamina1.com/" },
  },
};
