import { Chain } from 'wagmi';

export const coreTestnet = {
  id: 1115,
  name: 'Core Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Core',
    symbol: 'tCORE',
  },
  rpcUrls: {
    public: { http: ['https://rpc.test.btcs.network'] },
    default: { http: ['https://rpc.test.btcs.network'] },
  },
  blockExplorers: {
    default: { name: 'CoreScan', url: 'https://scan.test.btcs.network' },
  },
  testnet: true,
} satisfies Chain;