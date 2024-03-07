//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFT.sol";

contract Member is NFT {
    
    address owner;
    uint256 public currentMembers;
    uint256 public totalSupply;

    // Token's membership
    mapping(address => uint256) expirations;

    constructor(string memory name, string memory symbol, uint256 _totalSupply) NFT(name, symbol) {
        totalSupply = _totalSupply;
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner,"Not the owner");
        _;
    }

    function mint(address _newMember, uint256 _months) public onlyOwner {
        require(addressBalance[_newMember]==0,"Already a member");
        require(_months > 0,"Not posible");
        require(totalSupply > currentMembers, "Limit of members exceeded");
        addressBalance[_newMember]++;
        tokenOwner[currentMembers] = _newMember;
        currentMembers++;
        expirations[_newMember] = block.number + (_months * 214500);   
        //1 day = 7150 blocks  //1 month = 214500 blocks
    }   

    function renew(address _newMember, uint256 _months) public onlyOwner {
        require(_months > 0,"Not posible");
        if (expirations[_newMember] > block.number) {
            expirations[_newMember] += (_months * 214500);
        } else {
            expirations[_newMember] = block.number + (_months * 214500);
        }
    }

    function isMembershipPaid(address _newMember) view public returns(bool){
        return expirations[_newMember] >= block.number;
    }

    function cadu(address _member) view public returns(uint256){
        return expirations[_member];
    }

    function getCurrentMembers() view public returns (uint256){
        return currentMembers;
    }
}
