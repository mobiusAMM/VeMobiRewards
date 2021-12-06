// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;

interface IVotingEscrow {
  function balanceOf(address account) external view returns (uint256);

  function totalSupply() external view returns (uint256);
}
