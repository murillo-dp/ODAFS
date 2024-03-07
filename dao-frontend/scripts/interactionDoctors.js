import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, abiHospital, contractHospital, contractODAFS } from "./constants.js"

//Connect Metamask
document.getElementById("connectWalletButton").addEventListener("click", event => {
    let account
    let button = event.target
    window.ethereum.request({ method: "eth_requestAccounts" }).then(accounts => {
        account = accounts[0]
        console.log(account)
        button.textContent = account.substring(0, 6) + "..."
    })
    console.log("Metamask connected")
})

//Proposal number botton
const back = document.querySelector(".back"),
    next = document.querySelector(".next")
let i = 1
let value = await ndoct()
console.log(value)
back.addEventListener("click", ()=>{
    if (i > 1) {
        i--
    }
    ver()
    console.log(i)
})
next.addEventListener("click", ()=>{
    if (i < value) {
        i++
    }
    ver()
    console.log(i)
})

//Add new doctor
const addDoctorButton = document.getElementById("addDoctor")
addDoctorButton.onclick = addDoctort

async function addDoctort(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractHospital, abiHospital, signer)
        var ta1 = document.getElementById("address");
        var addr = ta1.value;
        var ta2 = document.getElementById("numLicencia");
        var num = ta2.value;
        var ta3 = document.getElementById("name");
        var nme = ta3.value;
        var ta4 = document.getElementById("apellidos");
        var apellid = ta4.value;
        var ta5 = document.getElementById("photo");
        var phot = ta5.value;
        await contract.newDoctor(addr, num, nme, apellid, phot)
    } else {
        console.log("No metamask")
    }
}

//See doctor
async function ver(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractHospital, abiHospital, signer)
        if (await ndoct()>0) {
            
            var imageLink = await contract.uriS(i);
            var imageDiv = document.getElementById("image");
            var imgElement = document.createElement("img");
            imgElement.src = imageLink;
            imgElement.width = 200;
            imgElement.height = 150;
            imageDiv.innerHTML = "";
            imageDiv.appendChild(imgElement);

            let text = "<p>License Number:: " + await contract.numLicenciaS(i) + "</p>"
            text = text + "<p>Name: " + await contract.nombreS(i) + "</p>"
            text = text + "<p>Surname: " + await contract.apellidosS(i) + "</p>"
            text = text + "<p>Cases: " + await contract.casosTratadosS(i) + "</p>"
            text = text + "<p>Valoration: " + await contract.valoracionS(i) + "</p>"
            document.getElementById("docInfo").innerHTML = text
        } 
    } else {
        console.log("No metamask")
    }
}

//Num Doctores
async function ndoct(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractHospital, abiHospital, signer)
        const result = await contract.numDoctores()
        return parseInt(result)
    } else {
        console.log("No metamask")
    }
}

//Check if wallet connected
const isMetaMaskConnected = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.listAccounts()
    return accounts.length > 0
}
await isMetaMaskConnected().then((connected) => {
    if (connected) {
        document.getElementById("connectWalletButton").click()
    }
})

ver()
