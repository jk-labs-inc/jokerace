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
    public: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.hype-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}/evm`] },
    default: { http: [`https://${process.env.NEXT_PUBLIC_QUICKNODE_SLUG}.hype-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_KEY}/evm`] },
  },
  blockExplorers: {
    etherscan: { name: "Hyperliquid Mainnet Scan", url: "https://hyperevmscan.io/" },
    default: { name: "Hyperliquid Mainnet Scan", url: "https://hyperevmscan.io/" },
  },
};
