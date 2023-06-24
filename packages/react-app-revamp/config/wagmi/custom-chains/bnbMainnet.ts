export const bnbMainnet = {
  id: 56,
  name: 'BnbMainnet',
  network: 'bnbMainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    public: 'https://bsc-dataseed.binance.org/',
    default: 'https://bsc-dataseed.binance.org/',
  },
  blockExplorers: {
    escan: { name: 'BNB Explorer', url: 'https://bscscan.com' },
    default: { name: 'BNB Explorer', url: 'https://bscscan.com' },
  },
}
