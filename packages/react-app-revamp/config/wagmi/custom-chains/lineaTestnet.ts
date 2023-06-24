export const lineaTestnet = {
  id: 59140,
  name: 'LineaTestnet',
  network: 'LineaTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: 'https://rpc.goerli.linea.build',
    default: 'https://rpc.goerli.linea.build',
  },
  blockExplorers: {
    etherscan: { name: 'Linea Testnet Scan', url: 'https://goerli.lineascan.build/' },
    default: { name: 'Linea Testnet Scan', url: 'https://goerli.lineascan.build/' },
  },
}