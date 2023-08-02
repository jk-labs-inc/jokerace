export const gnosisMainnet = {
  id: 100,
  name: 'gnosisMainnet',
  network: 'gnosisMainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'xDAI',
    symbol: 'xDAI',
  },
  rpcUrls: {
    public: 'https://rpc.ankr.com/gnosis',
    default: 'https://rpc.ankr.com/gnosis',
  },
  blockExplorers: {
    etherscan: { name: 'Gnosis Etherscan', url: 'https://gnosisscan.io/' },
    default: { name: 'Gnosis Etherscan', url: 'https://gnosisscan.io/' },
  },
}