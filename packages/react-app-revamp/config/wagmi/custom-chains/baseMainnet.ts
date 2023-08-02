export const baseMainnet = {
  id: 8453,
  name: 'baseMainnet',
  network: 'baseMainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: 'https://mainnet.base.org',
    default: 'https://mainnet.base.org',
  },
  blockExplorers: {
    etherscan: { name: 'Base Mainnet Scan', url: 'https://basescan.org' },
    default: { name: 'Base Mainnet Scan', url: 'https://basescan.org' },
  },
}