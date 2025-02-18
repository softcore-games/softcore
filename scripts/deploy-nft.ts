import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import nftAbi from '../contracts/CoreNFT.json';

dotenv.config();

async function main() {
  // Connect to Core DAO network
  const provider = new ethers.providers.JsonRpcProvider(process.env.CORE_RPC_URL);
  
  // Load deployer wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  console.log('Deploying contracts with the account:', wallet.address);

  // Deploy NFT contract
  const NFTFactory = new ethers.ContractFactory(
    nftAbi.abi,
    nftAbi.bytecode,
    wallet
  );

  console.log('Deploying CoreNFT...');
  const nft = await NFTFactory.deploy();
  await nft.deployed();

  console.log('CoreNFT deployed to:', nft.address);
  
  // Verify the contract (if Core DAO has a block explorer API)
  if (process.env.CORE_EXPLORER_API_KEY) {
    console.log('Verifying contract...');
    try {
      await verifyContract(nft.address);
      console.log('Contract verified successfully');
    } catch (error) {
      console.error('Error verifying contract:', error);
    }
  }
}

async function verifyContract(contractAddress: string) {
  // Add verification logic here when Core DAO block explorer API is available
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });