//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFT.sol";

contract Doctor is NFT {
    
    uint256 public currentDoctors;
    mapping(uint256 => address) introducedBy;
    address owner;
    mapping(address => cv) doctorsCV;
    mapping(uint256 => address) loadDoc;
    //uint256 public totalSupply;

    //Image of doctor
    mapping(uint256 => string) tokenURI;

    struct cv {
        uint256 numLicencia;
        string nombre;
        string apellidos;
        uint256 casosTratados;
        uint256 valoracion;
    }

    constructor(string memory name, string memory symbol) NFT(name, symbol) {
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner,"Not the owner");
        _;
    }

    function mint(address doctor, uint256 _numLicencia, string memory _name, 
                    string memory _apellidos, string memory _photo) public onlyOwner{
        require(addressBalance[doctor]==0,"Already a doctor");
        introducedBy[currentDoctors] = msg.sender;
        addressBalance[doctor]++;
        tokenOwner[currentDoctors] = doctor;
        doctorsCV[doctor].numLicencia = _numLicencia;
        doctorsCV[doctor].nombre = _name;
        doctorsCV[doctor].apellidos = _apellidos;
        currentDoctors++;
        loadDoc[currentDoctors] = doctor;
        //Image
        tokenURI[currentDoctors] = _photo;
    }

    function valoracionMedia(address doctor) view public returns (uint256){
        if ((doctorsCV[doctor].casosTratados!=0)&&(doctorsCV[doctor].valoracion!=0)) {
            return doctorsCV[doctor].valoracion/doctorsCV[doctor].casosTratados;
        } else {
            return 0;
        }
    }

    function valorar(address doctor, uint256 nota) public onlyOwner {
        // Nota debe ser entre el 0 y 5
        require((nota >= 0 && nota <= 5), "Nota debe ser entre 0 y 5");
        doctorsCV[doctor].valoracion += nota;
        doctorsCV[doctor].casosTratados++;
    }

    function numLicenciaSee(uint256 _num) public view returns (uint256) {
        return doctorsCV[loadDoc[_num]].numLicencia;
    }

    function nombreSee(uint256 _num) public view returns (string memory) {
        return doctorsCV[loadDoc[_num]].nombre;
    }

    function apellidosSee(uint256 _num) public view returns(string memory) {
        return doctorsCV[loadDoc[_num]].apellidos;
    }

    function casosTratadosSee(uint256 _num) public view returns(uint256) {
        return doctorsCV[loadDoc[_num]].casosTratados;
    }

    function valoracionSee(uint256 _num) public view returns(uint256) {
        return valoracionMedia(loadDoc[_num]);
    }

    function getCurrentDoctors() public view returns (uint256) {
        return currentDoctors;
    }

    function getURI(uint256 _num) public view returns(string memory) {
        return tokenURI[_num];
    }
}
