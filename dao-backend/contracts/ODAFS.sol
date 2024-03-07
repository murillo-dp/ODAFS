// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Vault.sol";
import "./DAO.sol";
import "./Doctor.sol";
import "./Member.sol";

// Interface for interacting with pharmacies
interface IPharmacy {
    function buy(uint256 _id, uint _amount) external payable;
    function productPrice(uint256 _id) view external returns(uint256);
}

// Interface for interacting with hospitals
interface IHospital {
    function payTreatment(uint256 _id, uint256 _nota) external payable;
    function priceTreatment(uint256 _id) external returns(uint256);
}

//Organizacion Descentralizada AutoOrganizada para la gestion de Fondos Sanitarios
contract ODAFS is Vault, DAO{
    
    mapping(uint256 => address) proposedBy;

    // When the smart contract is deployed we also deploy Members and Doctors contracts
    //Vault public vault = new Vault();
    Member public members = new Member("Member NFTs", "MEM",1000);

    modifier onlyMember() {
        require(members.balanceOf(msg.sender)>0, "Not member");
        require(members.isMembershipPaid(msg.sender), "Membership not paid");
        _;
    }

    modifier onlyCreator(uint256 _num) {
        require(proposedBy[_num] == msg.sender, "Not cretor of proposal");
        _;
    }

    function isMember(address _newMember) view public returns(bool){
        return ((members.balanceOf(_newMember)>0)&&(members.isMembershipPaid(_newMember)));
    }

    function cadu(address _member) view public returns(uint256){
        return members.cadu(_member);
    }

    function voteInLast(bool _ballot) public onlyMember{
        _vote(_ballot, last);
    }

    function vote(bool _ballot, uint256 _num) public onlyMember{
        _vote(_ballot, _num);
        if (inFavorOf(_num)>(members.getCurrentMembers()/2)) {
            sendEther(amountOf(_num), receiverOf(_num));
        }
    }
    
    function addSendProposal(address _receiver, uint256 _amount) public onlyMember {
        _addSendProposal(_receiver, _amount);
    }

    function addSendProposalD(address _receiver, uint256 _amount, string memory _description) public onlyMember {
        _addSendProposalD(_receiver, _description, _amount);
    }

    function addProposal() public onlyMember {
        _addProposal();
    }

    function addProposalD(string memory _description) public onlyMember {
        _addProposalD(_description);
    }

    function closeProposal(uint256 _num) public onlyCreator(_num) {
        uint256 value = _closeProposal(_num);
        if (resultOf(_num)) {
            sendEther(value, receiverOf(_num));
        }
    }

    function toMember() public payable {
        require(msg.value >= (4 ether), "Not enough ether");
        uint256 months = msg.value / 4000000000000000000;
        if (members.balanceOf(msg.sender) <= 0) {
            members.mint(msg.sender, months);
        } else {
            members.renew(msg.sender, months);
        }
        uint256 money = (msg.value - (msg.value / 20)); // 95%
        receiveEther(money);
        uint256 solidary = msg.value / 20; // 5%
        receiveDonation(solidary);
    }

    function payPharmacy(address pharmacy, uint256 _id, uint _amount) public onlyMember{
        uint256 aux = IPharmacy(pharmacy).productPrice(_id);
        require(aux * _amount <= balance, "No ether");
        IPharmacy(pharmacy).buy{value: aux * _amount + 1}(_id, _amount);
        balance -= aux * _amount;
    }

    function donatePharmacy(address pharmacy, uint256 _id, uint _amount) public {
        uint256 aux = IPharmacy(pharmacy).productPrice(_id);
        require(aux * _amount <= solidaryBalance, "No ether");
        IPharmacy(pharmacy).buy{value: aux * _amount + 1}(_id, _amount);
        solidaryBalance -= aux * _amount;
    }

    function payHospital(address hospital, uint256 _id, uint _nota) public onlyMember{
        uint256 price = IHospital(hospital).priceTreatment(_id);
        require(price <= balance, "No ether");
        IHospital(hospital).payTreatment{value: price + 1}(_id, _nota);
        balance -= price;
    }

    function donateHospital(address hospital, uint256 _id, uint _nota) public {
        uint256 price = IHospital(hospital).priceTreatment(_id);
        require(price <= solidaryBalance, "No ether");
        IHospital(hospital).payTreatment{value: price + 1}(_id, _nota);
        solidaryBalance -= price;
    }
}
