// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;

// https://docs.synthetix.io/contracts/source/interfaces/istakingrewards
interface IStakingRewards {
  // Views

  function balanceOf(address account) external view returns (uint256);

  function earned(address account) external view returns (uint256);

  function getRewardForDuration() external view returns (uint256);

  function lastTimeRewardApplicable() external view returns (uint256);

  function rewardPerToken() external view returns (uint256);

  function rewardsDistribution() external view returns (address);

  function rewardsToken() external view returns (address);

  function totalSupply() external view returns (uint256);

  // Mutative

  function getReward() external;
}
