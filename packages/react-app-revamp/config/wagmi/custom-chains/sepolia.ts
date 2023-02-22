export const sepolia = {
  id: 11155111,
  name: 'sepolia',
  network: 'sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: 'https://rpc.sepolia.dev',
    default: 'https://rpc.sepolia.dev',
  },
  blockExplorers: {
    etherscan: { name: 'Sepolia Etherscan', url: 'https://sepolia.etherscan.io' },
    default: { name: 'Sepolia Otterscan', url: 'https://sepolia.otterscan.io' },
  },
}