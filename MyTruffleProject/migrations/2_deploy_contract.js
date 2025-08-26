const Staking = artifacts.require("Staking");

module.exports = async function (deployer, network, accounts) {
  // Accounts
  const owner = "0x89B66e470F952E21a43B1c5d9Db310d847f0f02A"; // Contract owner
  const platform = "0x4b10bF011Fe9A2e07d6571726b59368B4Ef67920"; // Platform address for penalties

  // Use the already deployed ERC20Mock token address
  const tokenAddress = "0x32fCbF45083D05bDfFc95cd84bA809ed346876d6"; // Replace with your deployed ERC20Mock token address

  // Deploy Staking Contract
  await deployer.deploy(Staking, platform, tokenAddress);
  const stakingInstance = await Staking.deployed();

  console.log("Staking Contract deployed at:", stakingInstance.address);
};
