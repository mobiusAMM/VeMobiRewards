import { expect } from "chai";
import { ethers } from "hardhat";
import {
  MobiStakingRewards,
  IERC20Mintable,
  NonTransferable,
  MobiStakingRewards__factory,
} from "../typechain-types";

describe("Swap", function () {
  let stakingContract: MobiStakingRewards;
  let rewardToken: IERC20Mintable;
  let stakingToken: NonTransferable;
  let signer: string;
  let otherSigner: string;
  const INITIAL_MINT_AMOUNT = "100000000000000000";
  const REWARD_AMOUNT = "60480000"; // 100 every second!

  this.beforeAll(async () => {
    const [owner, other] = await ethers.getSigners();
    signer = await owner.getAddress();
    otherSigner = await other.getAddress();

    const ERC20 = await ethers.getContractFactory("IERC20Mintable");
    const VotingEscrow = await ethers.getContractFactory("NonTransferable");
    const Staking = await ethers.getContractFactory("MobiStakingRewards");

    rewardToken = (await ERC20.deploy()) as IERC20Mintable;
    stakingToken = (await VotingEscrow.deploy()) as NonTransferable;
    stakingContract = (await Staking.deploy(
      signer,
      signer,
      rewardToken.address,
      stakingToken.address
    )) as MobiStakingRewards;
    rewardToken.mint(stakingContract.address, REWARD_AMOUNT, {
      from: signer,
    });
    stakingToken.mint(signer, INITIAL_MINT_AMOUNT, { from: signer });
    stakingToken.mint(otherSigner, INITIAL_MINT_AMOUNT, { from: signer });

    stakingContract.notifyRewardAmount(REWARD_AMOUNT);
  });
  it("Queries the balance of a user", async function () {
    const expected = INITIAL_MINT_AMOUNT;
    const actual = await stakingContract.balanceOf(signer);
    expect(actual).equal(expected);
  });
  it("Queries the total supply of Voting Escrow", async function () {
    const expected = `${parseInt(INITIAL_MINT_AMOUNT) * 2}`;
    const actual = await stakingContract.totalSupply();
    expect(actual).equal(expected);
  });
  it("Rewards tokens!", async function () {
    const balanceBefore = await rewardToken.balanceOf(signer);
    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);
    await stakingContract.getReward({ from: signer });
    const balanceAfter = await rewardToken.balanceOf(signer);
    expect(balanceAfter.sub(balanceBefore).toNumber()).greaterThan(0);
  });
  it("Rewards tokens at the expected rate", async function () {
    const rate = 100 / 2;
    const time = 3600;

    // Start Fresh
    await stakingContract.getReward({ from: signer });
    const balanceBefore = await rewardToken.balanceOf(signer);

    await ethers.provider.send("evm_increaseTime", [time]);
    await ethers.provider.send("evm_mine", []);
    await stakingContract.getReward({ from: signer });
    const balanceAfter = await rewardToken.balanceOf(signer);
    expect(balanceAfter.sub(balanceBefore).toNumber()).equal(rate * time);
    const leftToClaim = await stakingContract.earned(signer);
    expect(leftToClaim.toNumber()).equal(0);
  });
});
