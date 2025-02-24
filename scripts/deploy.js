const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  const SoftCoreNFT = await ethers.getContractFactory("SoftCoreNFT");
  const mySoftCoreNFT = await SoftCoreNFT.deploy();

  console.log("Contract address:", await mySoftCoreNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
