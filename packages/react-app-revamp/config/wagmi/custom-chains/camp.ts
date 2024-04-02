import { Chain } from "@rainbow-me/rainbowkit";

export const camp: Chain = {
  id: 90354,
  name: "camp",
  iconUrl: "/camp.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc-camp-network-4xje7wy105.t.conduit.xyz"],
    },
    default: {
      http: ["https://rpc-camp-network-4xje7wy105.t.conduit.xyz"],
    },
  },
  blockExplorers: {
    etherscan: { name: "Camp Block Explorer", url: "https://explorerl2new-camp-network-4xje7wy105.t.conduit.xyz/" },
    default: { name: "Camp Block Explorer", url: "https://explorerl2new-camp-network-4xje7wy105.t.conduit.xyz/" },
  },
};
