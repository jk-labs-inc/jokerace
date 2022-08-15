// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("GenericVotesTimestampToken", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: ["joketest", "JOKE", "0xd698e31229aB86334924ed9DFfd096a71C686900", ethers.utils.parseEther("10000"), true],
    log: true,
    waitConfirmations: 5,
  });
  
  const GenericVotesTimestampToken = await ethers.getContract("GenericVotesTimestampToken", deployer);

  await deploy("Contest", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: ["joking", "Enter a joke", GenericVotesTimestampToken.address, GenericVotesTimestampToken.address, [5, 10, 10, 7, ethers.utils.parseEther("1"), 2, 100, 1, 0]],
    log: true,
    waitConfirmations: 5,
  });

  await deploy("ERC20VotesTimestampWrapper", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: ["0x59e36d05E47BF17Eb5753aA1F04b2164f1606A45", "Wrapped JOKE", "wJOKE", true],
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  // const YourContract = await ethers.getContract("YourContract", deployer);
  /*  await YourContract.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // await yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */


  //If you want to send value to an address from the deployer
  // const deployerWallet = ethers.provider.getSigner()
  // await deployerWallet.sendTransaction({
  //   to: "0xd698e31229aB86334924ed9DFfd096a71C686900",
  //   value: ethers.utils.parseEther("1")
  // })


  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: YourContract.address,
  //       contract: "contracts/YourContract.sol:YourContract",
  //       contractArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["YourContract"];
