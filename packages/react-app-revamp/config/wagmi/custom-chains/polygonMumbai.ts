export const polygonMumbai = {
  id: 80001,
  name: 'polygonMumbai',
  network: 'polygonMumbai',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    public: 'https://rpc.ankr.com/polygon_mumbai',
    default: 'https://rpc.ankr.com/polygon_mumbai',
  },
  blockExplorers: {
    etherscan: { name: 'Polygon Mumbai Etherscan', url: 'https://mumbai.polygonscan.com/' },
    default: { name: 'Polygon Mumbai Etherscan', url: 'https://mumbai.polygonscan.com/' },
  },
}