export const polygonZkMainnet = {
  id: 1101,
  name: 'PolygonZkMainnet',
  network: 'polygonZkMainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: 'https://zkevm-rpc.com',
    default: 'https://zkevm-rpc.com',
  },
  blockExplorers: {
    etherscan: { name: 'Polygon zkEvm Mainnet Scan', url: 'https://zkevm.polygonscan.com/' },
    default: { name: 'Polygon zkEvm Mainnet Scan', url: 'https://zkevm.polygonscan.com/' },
  },
}