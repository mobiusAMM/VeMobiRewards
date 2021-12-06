import { DeployFunction } from "hardhat-deploy/types";

const deployMobiStakingRewards: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnnamedAccounts,
}) {
  // await hre.run('compile');
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const VEMOBI_ADDRESS = "0xd813a846aA9D572140d7ABBB4eFaC8cD786b4c0E";
  const DISTRIBUTOR_ADDRESS = "0x16E319d8dAFeF25AAcec0dF0f1E349819D36993c";
  const OWNER = "0x16E319d8dAFeF25AAcec0dF0f1E349819D36993c";
  const REWARD_TOKEN = "0x471EcE3750Da237f93B8E339c536989b8978a438";

  const SafeERC20 = await deploy("SafeERC20", { from: deployer, log: true });
  const SafeMath = await deploy("SafeMath", { from: deployer, log: true });

  const args = [OWNER, DISTRIBUTOR_ADDRESS, REWARD_TOKEN, VEMOBI_ADDRESS];
  await deploy("MobiStakingRewards", {
    from: deployer,
    args,
    log: true,
    libraries: {
      SafeERC20: SafeERC20.address,
      SafeMath: SafeMath.address,
    },
  });
};

export default deployMobiStakingRewards;
deployMobiStakingRewards.id = "deploy_staking";
deployMobiStakingRewards.tags = ["Staking"];
