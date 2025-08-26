const Staking = artifacts.require("Staking");
const Token = artifacts.require("ERC20Mock"); // Assuming you're using a mock ERC20 token for testing

contract("Staking", (accounts) => {
  const [owner, platform, staker] = accounts;
  let stakingInstance, tokenInstance;

  beforeEach(async () => {
    console.log("Deploying new contract instances...");

    // Deploy a mock ERC20 token for testing
    tokenInstance = await Token.new("MockToken", "MTK", 1000000, { from: owner }); // Corrected constructor arguments

    // Deploy the Staking contract
    stakingInstance = await Staking.new(platform, tokenInstance.address, { from: owner });

    // Allocate tokens to the staker for testing
    await tokenInstance.transfer(staker, 100, { from: owner });

    // Approve the staking contract to spend staker's tokens
    await tokenInstance.approve(stakingInstance.address, 100, { from: staker });
  });

  // Test: Owner and platform are set correctly
  it("should set correct owner and platform address", async () => {
    console.log("Running the owner and platform test");

    const contractOwner = await stakingInstance.owner();
    const contractPlatform = await stakingInstance.platform();

    assert.equal(contractOwner, owner, "Owner should be set correctly");
    assert.equal(contractPlatform, platform, "Platform should be set correctly");
  });

  // Test: Staking logic
  it("should allow a user to stake tokens and set correct duration", async () => {
    console.log("Testing staking functionality");

    await stakingInstance.stake(90, 7200, { from: staker }); // Staking 90 tokens for 2 hours

    const stakerBalance = await stakingInstance.balance(staker);
    const stakingEndTime = await stakingInstance.stakingEndTime(staker);

    assert.equal(stakerBalance.toString(), "90", "Staker's balance should be updated correctly");
    assert(stakingEndTime > 0, "Staking end time should be set");
  });

  // Test: Rewards logic
  it("should calculate and distribute rewards correctly", async () => {
    console.log("Testing reward distribution");

    await stakingInstance.stake(90, 7200, { from: staker });

    // Simulate the passage of time (2 hours in seconds)
    await time.increase(7200);

    const initialTokenBalance = BigInt(await tokenInstance.balanceOf(staker));

    await stakingInstance.reward({ from: staker }); // Claim rewards

    const finalTokenBalance = BigInt(await tokenInstance.balanceOf(staker));
    const expectedReward = BigInt(2);

    assert.equal(
      finalTokenBalance - initialTokenBalance,
      expectedReward,
      "Rewards should be transferred correctly"
    );

    // Ensure balance and staking time are reset
    const stakerBalance = await stakingInstance.balance(staker);
    const stakingEndTime = await stakingInstance.stakingEndTime(staker);
    assert.equal(stakerBalance.toString(), "0", "Staker's balance should be reset");
    assert.equal(stakingEndTime.toString(), "0", "Staking end time should be reset");
  });

  // Test: Withdraw tokens with penalty for early withdrawal
  it("should allow withdrawal with penalty if unstaked early", async () => {
    console.log("Testing early withdrawal with penalty");

    await stakingInstance.stake(90, 7200, { from: staker });

    // Attempt to withdraw before the staking period ends
    await stakingInstance.withdrawTokens({ from: staker });

    const stakerBalance = await tokenInstance.balanceOf(staker);
    const penalty = 90 / 10; // 10% penalty
    const expectedBalance = 90 - penalty;

    assert.equal(
      stakerBalance.toString(),
      expectedBalance.toString(),
      "Staker should receive the remaining tokens after penalty"
    );

    // Ensure balance and staking time are reset
    const contractStakerBalance = await stakingInstance.balance(staker);
    const stakingEndTime = await stakingInstance.stakingEndTime(staker);
    assert.equal(contractStakerBalance.toString(), "0", "Staker's balance should be reset");
    assert.equal(stakingEndTime.toString(), "0", "Staking end time should be reset");
  });

  // Test: Update platform address (only owner)
  it("should allow only the owner to update the platform address", async () => {
    console.log("Testing platform address update");

    const newPlatform = accounts[3];

    await stakingInstance.updatePlatform(newPlatform, { from: owner });

    const updatedPlatform = await stakingInstance.platform();
    assert.equal(updatedPlatform, newPlatform, "Platform address should be updated correctly");

    // Ensure non-owner cannot update the platform
    try {
      await stakingInstance.updatePlatform(accounts[4], { from: staker });
      assert.fail("Non-owner should not be able to update the platform");
    } catch (error) {
      assert(error.message.includes("Only the owner can perform this action"), "Expected onlyOwner restriction");
    }
  });
});
