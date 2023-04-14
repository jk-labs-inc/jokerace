// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Contest", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: ["joking", "Enter a joke", 
           '0x626c756500000000000000000000000000000000000000000000000000000000', 
           '0x626c756500000000000000000000000000000000000000000000000000000000', 
           [5, 10, 10, 7, ethers.utils.parseEther("1"), 2, 100, 1, 1]],
    log: true,
    waitConfirmations: 5,
  });

  const ContestContract = await ethers.getContract("Contest", deployer);
  
  await deploy("RewardsModule", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [[1, 2, 3], [3, 2, 1], ContestContract.address],
    log: true,
    waitConfirmations: 5,
  });
  
};
module.exports.tags = ["YourContract"];
