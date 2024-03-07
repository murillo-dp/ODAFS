// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vault {

    // Control contract balance
    uint256 public balance;
    uint256 public solidaryBalance;

    // Send vault's ether
    function sendEther(uint _amount, address _receiver) internal {
        require(_amount <= balance, "No ether");
        (bool sent, ) = _receiver.call{value: _amount}("");
        require(sent, "Failed to send Ether");
        balance -= _amount;
    }

    // Send donation's ether
    function sendDonation(uint _amount, address _receiver) internal {
        require(_amount <= solidaryBalance, "No ether");
        (bool sent, ) = _receiver.call{value: _amount}("");
        require(sent, "Failed to send Ether");
        solidaryBalance -= _amount;
    }

    // Receive ether
    function receiveEther(uint256 _amount) internal {
        require(_amount > 0, "No ether");
        balance += _amount;
    }

    // Receive donations
    function receiveDonation(uint256 _amount) internal {
        require(_amount > 0, "No ether");
        solidaryBalance += _amount;
    }

    // Move vault's ether to solidary balance
    function moveToSolidary(uint256 _amount) internal {
        require(_amount < balance, "Not enough ether");
        balance -= _amount;
        solidaryBalance += _amount;
    }

    // Ether transferred direct to the contract is considered 
    // donation
    fallback() external payable {
        solidaryBalance += msg.value;
    }

    receive() external payable {
        solidaryBalance += msg.value;
    }
}
