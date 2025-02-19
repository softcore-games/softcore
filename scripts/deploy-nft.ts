import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as nftArtifact from "../contracts/CoreNFT.json";

dotenv.config();

async function main() {
  // Connect to Core DAO network
  const provider = new ethers.JsonRpcProvider(process.env.CORE_RPC_URL);

  if (!process.env.PRIVATE_KEY) {
    throw new Error("Missing PRIVATE_KEY environment variable");
  }

  // Load deployer wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("Deploying contracts with the account:", wallet.address);

  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", ethers.formatEther(balance));

  // Deploy NFT contract
  const factory = new ethers.ContractFactory(
    nftArtifact.abi,
    nftArtifact?.bytecode,
    wallet
  );

  console.log("Deploying CoreNFT...");
  const nft = await factory.deploy();
  await nft.waitForDeployment();

  const contractAddress = await nft.getAddress();
  console.log("CoreNFT deployed to:", contractAddress);

  console.log("Verify with:");
  console.log(`npx hardhat verify --network testnet ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
