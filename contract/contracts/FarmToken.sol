// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FarmToken is ERC20 {
    constructor() public ERC20("Farm Token", "FARM"){
        _mint(msg.sender, 1000000000000000000000000000);
    }
}