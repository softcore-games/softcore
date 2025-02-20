const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const SoftcoreNFT = await ethers.getContractFactory("SoftcoreNFT");
  const nft = await SoftcoreNFT.deploy();
  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log("SoftcoreNFT deployed to:", address);

  // Save the contract address
  const deployment = {
    address: address,
    network: network.name,
  };

  fs.writeFileSync("deployment.json", JSON.stringify(deployment, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
