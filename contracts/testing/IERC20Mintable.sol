// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

interface IERC20Mintable is ERC20Mintable {}

interface NonTransferable is ERC20Mintable {
  /**
   * @dev See `IERC20.transfer`.
   *
   * Requirements:
   *
   * - `recipient` cannot be the zero address.
   * - the caller must have a balance of at least `amount`.
   */
  function transfer(address recipient, uint256 amount) public returns (bool) {
    revert();
  }

  /**
   * @dev See `IERC20.transferFrom`.
   *
   * Emits an `Approval` event indicating the updated allowance. This is not
   * required by the EIP. See the note at the beginning of `ERC20`;
   *
   * Requirements:
   * - `sender` and `recipient` cannot be the zero address.
   * - `sender` must have a balance of at least `value`.
   * - the caller must have allowance for `sender`'s tokens of at least
   * `amount`.
   */
  function transferFrom(
    address sender,
    address recipient,
    uint256 amount
  ) public returns (bool) {
    revert();
  }
}
