export const evmosMainnet = {
  id: 9001,
  name: 'EvmosMainnet',
  network: 'evmosMainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Evmos',
    symbol: 'EVMOS',
  },
  rpcUrls: {
    public: 'https://eth.bd.evmos.org:8545',
    default: 'https://eth.bd.evmos.org:8545',
  },
  blockExplorers: {
    escan: { name: 'escan.live', url: 'https://escan.live' },
    default: { name: 'escan.live', url: 'https://escan.live' },
  },
}
