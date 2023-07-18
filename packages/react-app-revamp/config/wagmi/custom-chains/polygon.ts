export const polygon = {
  id: 137,
  name: 'polygon',
  network: 'polygon',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    public: 'https://rpc.ankr.com/polygon',
    default: 'https://rpc.ankr.com/polygon',
  },
  blockExplorers: {
    etherscan: { name: 'Polygon Mainnet Etherscan', url: 'https://polygonscan.com/' },
    default: { name: 'Polygon Mainnet Etherscan', url: 'https://polygonscan.com/' },
  },
}