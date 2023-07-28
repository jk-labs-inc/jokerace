import { Chain } from "wagmi";

export const lootChainTestnet = {
  id: 9088912,
  name: "lootChainTestnet",
  network: "lootChainTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://testnet.rpc.lootchain.com/http"],
    },
    default: {
      http: ["https://testnet.rpc.lootchain.com/http"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Loot Chain Testnet Block Explorer", url: "https://testnet.explorer.lootchain.com/" },
    default: { name: "Loot Chain Testnet Block Explorer", url: "https://testnet.explorer.lootchain.com/" },
  },
} as const satisfies Chain;
