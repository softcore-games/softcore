import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    core: {
      url: process.env.CORE_RPC_URL || "https://rpc.coredao.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    testnet: {
      url: process.env.CORE_TESTNET_RPC_URL || "https://rpc.test.btcs.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      core: process.env.CORE_EXPLORER_API_KEY || "",
    },
    customChains: [
      {
        network: "core",
        chainId: 1116,
        urls: {
          apiURL: "https://openapi.coredao.org/api",
          browserURL: "https://scan.coredao.org",
        },
      },
      {
        network: "testnet",
        chainId: 1115,
        urls: {
          apiURL: "https://api-testnet.coredao.org/api",
          browserURL: "https://scan.test.btcs.network",
        },
      },
    ],
  },
};

export default config;