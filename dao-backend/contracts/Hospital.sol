// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Doctor.sol";

contract Hospital {

    // Contract's owner
    address public owner;

    // NFTs of hospital's doctors
    Doctor public doctors = new Doctor("Doctor NFTs", "DOC");

    // Waiting list structure
    uint256 index;
    mapping(uint256 => treatment) waitingList;
    mapping(address => bool) isInWaitingList;
    mapping(address => uint256) waitingTicket;

    // Treatment status
    enum state { 
        NOREQUEST, WAITING, DIAGNOSED, COMPLETED 
    }

    // Treatment data type
    struct treatment{
        address patient;
        state status;
        address doctor;
        uint256 cost;
        string diagnostic;
    }

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier onlyDoctor() {
        require(doctors.balanceOf(msg.sender) > 0, "Not doctor");
        _;
    }

    // Check treatment status
    function treatmentStatus(uint256 _id) view public returns(state){
        return waitingList[_id].status;
    }
    
    // Check if address is doctor
    function isDoctor(address _doctor) public view returns(bool){
        return doctors.balanceOf(_doctor) > 0;
    }

    // Create NFT doctor
    function newDoctor(address _newDoctor, uint256 _numLicencia, 
               string memory _name, string memory _apellidos, string memory _photo) public payable onlyOwner {
        doctors.mint(_newDoctor, _numLicencia, _name, _apellidos, _photo);
    }

    // Check if address is waiting
    function isWaiting(address _user) public view returns(bool){
        return isInWaitingList[_user];
    }

    // ID of treatment/Treatment ticket
    function numTicket(address _user) public view returns(uint256){
        return waitingTicket[_user];
    }

    // Patien request to be diagnose
    function requestTreatment() public {
        require(!isInWaitingList[msg.sender], "It is already in the waiting list");
        waitingList[index].patient = msg.sender;
        waitingList[index].status = state.WAITING;
        isInWaitingList[msg.sender] = true;
        waitingTicket[msg.sender] = index;
        index++;
    } 

    // Doctor diagnose patient and creates a budget for the treatment
    function diagnosePatient(uint256 _id, uint256 _cost, string memory _diagnostic) public onlyDoctor {
        require(waitingList[_id].status == state.WAITING, "This treatment is not waiting diagnose");
        waitingList[_id].doctor = msg.sender;
        waitingList[_id].diagnostic = _diagnostic;
        waitingList[_id].cost = _cost;
        waitingList[_id].status = state.DIAGNOSED;
    }

    // Once is paid the treatment starts
    function payTreatment(uint256 _id, uint256 _nota) public payable{
        require(waitingList[_id].status == state.DIAGNOSED, "This treatment is not diagnosed");
        require(waitingList[_id].cost < msg.value, "Not enought ether");
        waitingList[_id].status = state.COMPLETED;
        isInWaitingList[waitingList[_id].patient] = false;
        doctors.valorar(waitingList[_id].doctor, _nota);
    } 

    function uriS(uint256 _num) public view returns(string memory) {
        return doctors.getURI(_num);
    }

    function numLicenciaS(uint256 _num) public view returns (uint256) {
        return doctors.numLicenciaSee(_num);
    }

    function nombreS(uint256 _num) public view returns (string memory) {
        return doctors.nombreSee(_num);
    }

    function apellidosS(uint256 _num) public view returns(string memory) {
        return doctors.apellidosSee(_num);
    }

    function casosTratadosS(uint256 _num) public view returns(uint256) {
        return doctors.casosTratadosSee(_num);
    }

    function valoracionS(uint256 _num) public view returns(uint256) {
        return doctors.valoracionSee(_num);
    }

    // See doctors rating
    function doctorRating(address _doctor) public view returns(uint256){
        return doctors.valoracionMedia(_doctor);
    }

    function numDoctores() public view returns(uint256) {
        return doctors.getCurrentDoctors();
    }

    function priceTreatment(uint256 _id) public view returns(uint256){
        return waitingList[_id].cost;
    }

    function getDoctor(uint256 _id) public view returns(address){
        return waitingList[_id].doctor;
    }

    function getDescription(uint256 _id) public view returns(string memory){
        return waitingList[_id].diagnostic;
    }

}
