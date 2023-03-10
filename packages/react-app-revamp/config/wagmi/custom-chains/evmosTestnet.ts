export const evmosTestnet = {
    id: 9000,
    name: 'EvmosTestnet',
    network: 'evmosTestnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Testnet Evmos',
      symbol: 'tEVMOS',
    },
    rpcUrls: {
      public: 'https://eth.bd.evmos.dev:8545',
      default: 'https://eth.bd.evmos.dev:8545',
    },
    blockExplorers: {
      mintscan: { name: 'Mintscan', url: 'https://testnet.mintscan.io/evmos-testnet' },
      default: { name: 'Mintscan', url: 'https://testnet.mintscan.io/evmos-testnet' },
    },
  }
  