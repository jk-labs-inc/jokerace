import { Chain } from "@rainbow-me/rainbowkit";

export const hyperliquid: Chain = {
  id: 999,
  name: "hyperliquid",
  iconUrl: "/hyperliquid.svg",
  nativeCurrency: {
    decimals: 18,
    name: "HYPE",
    symbol: "HYPE",
  },
  rpcUrls: {
    public: { http: [`https://rpc.hypurrscan.io`] },
    default: {
      http: [
        `https://${import.meta.env.VITE_QUICKNODE_SLUG}.hype-mainnet.quiknode.pro/${import.meta.env.VITE_QUICKNODE_KEY}/evm`,
      ],
    },
  },
  blockExplorers: {
    etherscan: { name: "Hyperliquid Mainnet Scan", url: "https://hyperevmscan.io/" },
    default: { name: "Hyperliquid Mainnet Scan", url: "https://hyperevmscan.io/" },
  },
};
