export const goerli = {
  id: 5,
  name: 'goerli',
  network: 'goerli',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: 'https://rpc.ankr.com/eth_goerli',
    default: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  },
  blockExplorers: {
    etherscan: { name: 'Goerli Etherscan', url: 'https://goerli.etherscan.io/' },
    default: { name: 'Goerli Etherscan', url: 'https://goerli.etherscan.io/' },
  },
}