import { Chain } from "@rainbow-me/rainbowkit";

export const nautilusChain: Chain = {
  id: 69420,
  name: "Degen",
  network: "degenChain",
  iconUrl: "/degen.png",
  nativeCurrency: {
    decimals: 18,
    name: "Degen",
    symbol: "DGN",
  },
  rpcUrls: {
    public: {
      http: ["https://api.evm.degen.dev.eclipsenetwork.xyz"],
    },
    default: {
      http: ["https://api.evm.degen.dev.eclipsenetwork.xyz"],
    },
  },
  blockExplorers: {
    default: { name: "Degensplorer'", url: "https://eclipse-degen.vercel.app/" },
  },
};
