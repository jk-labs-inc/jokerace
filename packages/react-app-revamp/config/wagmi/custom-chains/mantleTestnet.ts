export const mantleTestnet = {
  id: 5001,
  name: 'mantleTestnet',
  network: 'mantleTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Mantle',
    symbol: 'MNT',
  },
  rpcUrls: {
    public: 'https://rpc.testnet.mantle.xyz',
    default: 'https://rpc.testnet.mantle.xyz',
  },
  blockExplorers: {
    etherscan: { name: 'Mantle Testnet Scan', url: 'https://explorer.testnet.mantle.xyz' },
    default: { name: 'Mantle Testnet Scan', url: 'https://explorer.testnet.mantle.xyz' },
  },
}