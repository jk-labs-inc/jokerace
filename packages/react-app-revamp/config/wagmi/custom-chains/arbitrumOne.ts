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
    default: 'https://rpc.ankr.com/arbitrum',
  },
  blockExplorers: {
    etherscan: { name: 'Arbitrum Mainnet Etherscan', url: 'https://arbiscan.io/' },
    default: { name: 'Arbitrum Mainnet Etherscan', url: 'https://arbiscan.io/' },
  },
}