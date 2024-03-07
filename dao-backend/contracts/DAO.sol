// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DAO {

    struct Propuesta {
        bool open;
        uint256 inFavor;
        uint256 against;
        mapping(address => bool) hasVoted;
        address fundReceiver;
        uint256 amount;
        string description;
    }

    uint256 public last;
    mapping(uint256 => Propuesta) proposals;

    modifier hasntVoted() {
        require(!addressHasVoted(msg.sender), "Already voted");
        _;
    }

    modifier isOpenProposal(uint256 _proposalNum) {
        require(proposals[_proposalNum].open, "Proposal is closed");
        _;
    }

    function progress() public view returns (uint256, uint256) {
        return (proposals[last].inFavor, proposals[last].against);
    }

    function _addSendProposal(address _receiver, uint256 _amount) internal {
        ++last;
        proposals[last].open = true;
        proposals[last].fundReceiver = _receiver;
        proposals[last].amount = _amount;
    }

    function _addSendProposalD(address _receiver, string memory _description, uint256 _amount) internal {
        ++last;
        proposals[last].open = true;
        proposals[last].fundReceiver = _receiver;
        proposals[last].amount = _amount;
        proposals[last].description = _description;
    }

    function _addProposal() internal {
        ++last;
        proposals[last].open = true;
    }

    function _addProposalD(string memory _description) internal {
        ++last;
        proposals[last].open = true;
        proposals[last].description = _description;
    }

    function _closeProposal(uint256 _num) internal returns(uint256) {
        proposals[_num].open = false;
        return proposals[_num].amount;
    }

    function _vote(bool _ballot, uint256 _proposalNum) internal hasntVoted isOpenProposal(_proposalNum) {
        proposals[_proposalNum].hasVoted[msg.sender] = true;
        if (_ballot) {
            ++proposals[_proposalNum].inFavor;
        } else {
            ++proposals[_proposalNum].against;
        }
    }

    function addressHasVoted(address _user) public view returns (bool) {
        return proposals[last].hasVoted[_user];
    }

    function result() public view returns (bool) {
        if (proposals[last].inFavor > proposals[last].against) {
            return true;
        } else {
            return false;
        }
    }

    function resultOf(uint256 _num) public view returns (bool) {
        if (proposals[_num].inFavor > proposals[_num].against) {
            return true;
        } else {
            return false;
        }
    }

    function inFavorOf(uint256 _num) public view returns (uint256) {
        return proposals[_num].inFavor;
    }

    function againstOf(uint256 _num) public view returns (uint256) {
        return proposals[_num].against;
    }

    function receiverOf(uint256 _num) public view returns(address) {
        return proposals[_num].fundReceiver;
    }

    function amountOf(uint256 _num) public view returns(uint256) {
        return proposals[_num].amount;
    }

    function descriptionOf(uint256 _num) public view returns(string memory) {
        return proposals[_num].description;
    }
}