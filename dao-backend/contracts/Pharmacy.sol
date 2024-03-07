// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Pharmacy {

    // Contract's owner
    address public owner;

    // Contract's balance
    uint256 balance;
    
    // Pharmacy inventory
    uint256 public numOfProducts;
    mapping(uint256 => product) inventory;

    // Product data type
    struct product{
        string name;
        string description;
        uint256 price;
        uint256 stock;
    }

    // Assigns the contract's deployer as owner
    constructor() {
        owner = msg.sender;
    }

    // Only accesable by owner
    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // Add new product to the inventory
    function addProduct(string memory _name, string memory _description, uint256 _price) public onlyOwner{
        inventory[numOfProducts].name = _name;
        inventory[numOfProducts].description = _description;
        inventory[numOfProducts].price = _price;
        numOfProducts++;
    }

    // Add stock to existing product
    function addStock(uint256 _id, uint256 _amount) public onlyOwner{
        require(_id < numOfProducts, "Product doesnt exist");
        inventory[_id].stock += _amount;
    }

    // Name of a product
    function productName(uint256 _id) view public returns(string memory) {
        return inventory[_id].name;
    }

    // Description of a product
    function productDescription(uint256 _id) view public returns(string memory) {
        return inventory[_id].description;
    }

    // Price of a product
    function productPrice(uint256 _id) view public returns(uint256) {
        return inventory[_id].price;
    }

    // Stock of a product
    function productStock(uint256 _id) view public returns(uint256) {
        return inventory[_id].stock;
    }

    // Buy product
    function buy(uint256 _id, uint _amount) public payable {
        require(_amount < inventory[_id].stock, "Not enought stock");
        require((inventory[_id].price * _amount) < msg.value, "Not enought ether");
        balance += msg.value;
        inventory[_id].stock -= _amount;
    }

}
