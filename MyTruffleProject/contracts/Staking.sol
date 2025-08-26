// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    IERC20 public token; // Reference to the ERC20 token (ERC20MOCK)
    address public owner;
    address public platform;

    mapping(address => uint) public balance;
    mapping(address => uint) public stakingEndTime;
     mapping(address => uint) public stakingStartTimes;
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
     event Staked(address indexed user, uint amount, uint duration);
    constructor(address _platform, address _tokenAddress) {
        owner = msg.sender;
        platform = _platform;
        token = IERC20(_tokenAddress); // Initialize with ERC20MOCK address
    }

    function stake(uint _tokens, uint _duration) public {
    // Transfer tokens from the user to the contract
    token.transferFrom(msg.sender, address(this), _tokens);

    // Update the user's balance and staking end time
    balance[msg.sender] += _tokens;

    // Emit the staking event
    emit Staked(msg.sender, _tokens, _duration);
}

    function reward() public {
        uint currentTime = block.timestamp;
        uint stakedTime = stakingEndTime[msg.sender];
        require(currentTime >= stakedTime, "Staking duration not completed");

        uint rewards = 0;
        if (stakedTime - currentTime == 7200) {
            rewards = 2;
        } else if (stakedTime - currentTime == 86400) {
            rewards = 5;
        }

        require(rewards > 0, "No rewards available");
        token.transfer(msg.sender, rewards);

        balance[msg.sender] = 0;
        stakingEndTime[msg.sender] = 0;
    }

    function withdrawTokens() public {
        uint stakedAmount = balance[msg.sender];
        uint currentTime = block.timestamp;
        uint stakedTime = stakingEndTime[msg.sender];

        require(stakedAmount > 0, "No tokens staked");

        if (currentTime < stakedTime) {
            uint penalty = stakedAmount / 10;
            stakedAmount -= penalty;
            token.transfer(platform, penalty);
        }

        balance[msg.sender] = 0;
        stakingEndTime[msg.sender] = 0;
        token.transfer(msg.sender, stakedAmount);
    }

    function updatePlatform(address _platform) public onlyOwner {
        require(_platform != address(0), "Invalid platform address");
        platform = _platform;
    }
}
