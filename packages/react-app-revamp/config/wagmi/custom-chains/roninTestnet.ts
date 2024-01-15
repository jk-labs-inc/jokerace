import { Chain } from "@rainbow-me/rainbowkit";

export const roninTestnet: Chain = {
  id: 2021,
  name: "roninTestnet",
  network: "roninTestnet",
  iconUrl: "/contest/mona-lisa-moustache.png",
  nativeCurrency: {
    decimals: 18,
    name: "tRON",
    symbol: "tRON",
  },
  rpcUrls: {
    public: {
      http: ["https://saigon-testnet.roninchain.com/rpc"],
    },
    default: {
      http: ["https://saigon-testnet.roninchain.com/rpc"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Ronin Testnet Scan", url: "https://saigon-explorer.roninchain.com/" },
    default: { name: "Ronin Testnet Scan", url: "https://saigon-explorer.roninchain.com/" },
  },
  testnet: true,
};
