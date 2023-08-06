import { Chain } from "wagmi";

export const lootChainTestnet: Chain = {
  id: 9088912,
  name: "lootChainTestnet",
  network: "lootChainTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "AGLD",
    symbol: "AGLD",
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
};
