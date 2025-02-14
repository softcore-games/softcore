// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameToken is ERC20, Ownable {
    constructor() ERC20("SoftCore Token", "SCT") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Premium features require holding tokens
    function isPremiumHolder(address account) public view returns (bool) {
        return balanceOf(account) >= 100 * 10**decimals();
    }

    // Allow players to stake tokens for premium features
    mapping(address => uint256) private _stakedBalance;
    
    function stake(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, address(this), amount);
        _stakedBalance[msg.sender] += amount;
    }

    function unstake(uint256 amount) public {
        require(_stakedBalance[msg.sender] >= amount, "Insufficient staked balance");
        _stakedBalance[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
    }

    function getStakedBalance(address account) public view returns (uint256) {
        return _stakedBalance[account];
    }
}