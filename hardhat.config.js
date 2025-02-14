require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

module.exports = {
  solidity: '0.8.19',
  networks: {
    core_testnet: {
      url: 'https://rpc.test.btcs.network',
      accounts: [PRIVATE_KEY],
      chainId: 1115,
    },
  },
};
