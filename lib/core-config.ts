export const CORE_TESTNET_CONFIG = {
  chainId: '0x45b', // 1115 in hex
  chainName: 'Core Testnet',
  nativeCurrency: {
    name: 'Core',
    symbol: 'tCORE',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.test.btcs.network'],
  blockExplorerUrls: ['https://scan.test.btcs.network'],
};

export const CORE_MAINNET_CONFIG = {
  chainId: '0x1',
  chainName: 'Core Mainnet',
  nativeCurrency: {
    name: 'Core',
    symbol: 'CORE',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.coredao.org'],
  blockExplorerUrls: ['https://scan.coredao.org'],
};
