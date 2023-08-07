import { Chain } from "@rainbow-me/rainbowkit";

export const lootChainMainnet: Chain = {
  id: 5151706,
  name: "lootChainMainnet",
  network: "lootChainMainnet",
  iconUrl: "/lootchain.svg",
  nativeCurrency: {
    decimals: 18,
    name: "AGLD",
    symbol: "AGLD",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.lootchain.com/http"],
    },
    default: {
      http: ["https://rpc.lootchain.com/http"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Loot Chain Mainnet Block Explorer", url: "https://explorer.lootchain.com/" },
    default: { name: "Loot Chain Mainnet Block Explorer", url: "https://explorer.lootchain.com/" },
  },
};
