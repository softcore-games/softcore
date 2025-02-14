const hre = require("hardhat");

async function main() {
  // Deploy GameToken
  const GameToken = await hre.ethers.getContractFactory("GameToken");
  const gameToken = await GameToken.deploy();
  await gameToken.deployed();
  console.log("GameToken deployed to:", gameToken.address);

  // Deploy GameItems
  const GameItems = await hre.ethers.getContractFactory("GameItems");
  const gameItems = await GameItems.deploy();
  await gameItems.deployed();
  console.log("GameItems deployed to:", gameItems.address);

  // Save contract addresses
  const fs = require("fs");
  const addresses = {
    gameToken: gameToken.address,
    gameItems: gameItems.address
  };
  
  fs.writeFileSync("contracts.json", JSON.stringify(addresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });