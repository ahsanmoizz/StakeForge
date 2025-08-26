// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20MOCK is ERC20 {
    constructor(
        string memory name, 
        string memory symbol, 
        uint256 initialSupply
    ) ERC20(name, symbol) { // Use the passed arguments
        _mint(msg.sender, initialSupply * (10 ** decimals())); // Mint the specified supply
    }
}
