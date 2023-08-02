export const arbitrumOne = {
  id: 42161,
  name: 'arbitrumone',
  network: 'arbitrumone',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: 'https://rpc.ankr.com/arbitrum',
    default: `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  },
  blockExplorers: {
    etherscan: { name: 'Arbitrum Mainnet Etherscan', url: 'https://arbiscan.io/' },
    default: { name: 'Arbitrum Mainnet Etherscan', url: 'https://arbiscan.io/' },
  },
}