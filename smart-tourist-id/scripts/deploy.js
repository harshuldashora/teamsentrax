const hre = require("hardhat");

async function main(){
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with", deployer.address);

  const Tourist = await hre.ethers.getContractFactory("TouristID");
  const tourist = await Tourist.deploy(deployer.address);
  await tourist.deployed();
  console.log("TouristID deployed to:", tourist.address);
}
main().catch(console.error);

