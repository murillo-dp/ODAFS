//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC721.sol";

contract NFT is IERC721{
    
    // NFT name and symbol
    string public name;
    string public symbol;

    // Use for determine NFT owner 
    mapping(address => uint256) addressBalance;
    mapping(uint256 => address) tokenOwner;

    // Aprovals allow different user to transfer NFT that aren't theirs
    mapping(uint256 => address) tokenAprovals;
    mapping(address => mapping(address => bool)) operatorApprovals;

    // Sets name and symbol
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    // Token balance of address
    function balanceOf(address _owner) public view returns (uint256) {
        return addressBalance[_owner];
    }

    // Token owner
    function ownerOf(uint256 _tokenId) public view returns (address) {
        require(tokenOwner[_tokenId] != address(0), "NFT without owner");
        return tokenOwner[_tokenId];
    }

    // In this project safe transfers will act as normal transfers
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public {
        _transfer(msg.sender, _from, _to, _tokenId);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata) public {
        _transfer(msg.sender, _from, _to, _tokenId);
    }

    // Transfer NFT not owned by function caller
    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        _transfer(msg.sender, _from, _to, _tokenId);
    }

    // Only NFT owner or approved addresses can transfer
    function _transfer(address _sender, address _from, address _to, uint256 _tokenId) internal {
        require(_sender == tokenOwner[_tokenId] || _sender == tokenAprovals[_tokenId] || operatorApprovals[_from][_sender], "The sender is not the token owner or aproved");
        require(_to != address(0), "ERC721: transfer to the zero address");
        tokenOwner[_tokenId]= _to;
        addressBalance[_from]--;
        addressBalance[_to]++;
        if (tokenAprovals[_tokenId] != address(0))
        {
            tokenAprovals[_tokenId] = address(0);
        }
        emit Transfer(_from, _to, _tokenId);
    }

    // Approve different addresses for transfers
    function approve(address _to, uint256 _tokenId) public {
        require(msg.sender == tokenOwner[_tokenId], "Not owner of token");
        tokenAprovals[_tokenId] = _to;

        emit Approval(msg.sender, _to, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) public {
        require(msg.sender == _operator, "Not owner of token");
        operatorApprovals[msg.sender][_operator] = _approved;

        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId) public view returns (address operator) {
        return tokenAprovals[_tokenId];
    }

    function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
        return operatorApprovals[_owner][_operator];
    }
}