import { expect } from "chai";
import { ethers } from "hardhat";
import { MobiStakingRewards } from "../typechain-types";

describe("Swap", function () {
  let stakingContract: MobiStakingRewards;
  let rewardToken: IERC20;
  let stakingToken: IERC20;
  let signer: string;

  this.beforeAll(async () => {
    const [owner] = await ethers.getSigners();
    signer = await owner.getAddress();
    const ERC20 = await ethers.getContractFactory("LPToken");
    const Swap = ethers.getContractFactory("Swap");

    rewardToken = (await ERC20.deploy("Reward", "t1", "18")) as ERC20_T;
    stakingToken = (await ERC20.deploy("Test 2", "t2", "18")) as ERC20_T;
    swapContract = (await (
      await Swap
    ).deploy(
      [token1.address, token2.address],
      ["18", "18"],
      "Test",
      "t"
    )) as SwapContract;
    token1.mint(signer, "100000000000000000", { from: signer });
    token2.mint(signer, "100000000000000000", { from: signer });
    lpToken = ERC20.attach(await swapContract.getLpToken()) as ERC20_T;
  });
  it("Can be deposited into", async function () {
    const expectedIncrease = "1000";
    const initial = await lpToken.balanceOf(signer);
    const expected = initial.add(expectedIncrease);

    await token1.approve(swapContract.address, "500", { from: signer });
    await token2.approve(swapContract.address, "500", { from: signer });

    await swapContract.addLiquidity(["500", "500"], "999", { from: signer });
    const actual = await lpToken.balanceOf(signer);
    expect(actual).equal(expected);
  });
  it("Can facilitate a 1:1 swap", async function () {
    // Add liquidity :)
    await token1.approve(swapContract.address, "1000", { from: signer });
    await token2.approve(swapContract.address, "500", { from: signer });
    await swapContract.addLiquidity(["500", "500"], "999", { from: signer });

    // Now test a swap
    const expectedOut = "100";
    const expected = (await token2.balanceOf(signer)).add(expectedOut);
    const block = await ethers.provider.getBlock(
      await ethers.provider.getBlockNumber()
    );

    await swapContract.swap(
      token1.address,
      token2.address,
      "100",
      "99",
      block.timestamp + 100,
      { from: signer }
    );
    expect(await token2.balanceOf(signer)).equal(expected);
  });
});
