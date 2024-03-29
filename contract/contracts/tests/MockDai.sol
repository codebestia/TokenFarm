// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockDai is ERC20 {
    constructor() public ERC20("DAI Token", "DAI"){
        _mint(msg.sender, 10000000000000000000000);
    }
}