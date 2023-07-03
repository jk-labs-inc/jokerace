export const celoMainnet = {
  id: 42220,
  name: 'celoMainnet',
  network: 'celoMainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Celo',
    symbol: 'CELO',
  },
  rpcUrls: {
    public: 'https://forno.celo.org',
    default: 'https://forno.celo.org',
  },
  blockExplorers: {
    etherscan: { name: 'Celo Block Explorer', url: 'https://celoscan.io' },
    default: { name: 'Celo Block Explorer', url: 'https://celoscan.io' },
  },
}