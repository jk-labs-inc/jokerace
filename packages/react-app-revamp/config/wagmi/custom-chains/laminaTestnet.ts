import { Chain } from "@rainbow-me/rainbowkit";

export const laminaTestnet: Chain = {
  id: 764984,
  name: "laminaTestnet",
  iconUrl: "/lamina.png",
  nativeCurrency: {
    decimals: 18,
    name: "L1T",
    symbol: "L1T",
  },
  rpcUrls: {
    public: { http: ["https://subnets.avax.network/lamina1tes/testnet/rpc"] },
    default: { http: ["https://subnets.avax.network/lamina1tes/testnet/rpc"] },
  },
  blockExplorers: {
    etherscan: { name: "Lamina Testnet Scan", url: "https://subnets-test.avax.network/lamina1tes/" },
    default: { name: "Lamina Testnet Scan", url: "https://subnets-test.avax.network/lamina1tes/" },
  },
  testnet: true,
};
