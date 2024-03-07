import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, abiHospital, contractHospital, contractODAFS } from "./constants.js"

//Connect Metamask
document.getElementById("connectWalletButton").addEventListener("click", event => {
    let account
    let button = event.target
    window.ethereum.request({ method: "eth_requestAccounts" }).then(async accounts => {
        account = accounts[0]
        console.log(account)
        button.textContent = account.substring(0, 6) + "..."

        const solicitar = document.getElementById("solicitar");
        const waitin = document.getElementById("waiting");
        const diagnosed = document.getElementById("diagnosed");
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractHospital, abiHospital, signer)
        const booli = await contract.isWaiting(account)
        if (!booli) {
            solicitar.style.display = "block";
        } else if (await contract.treatmentStatus(await contract.numTicket(account)) == 1) {
            waitin.style.display = "block";
            let text = await contract.numTicket(account)
            document.getElementById("requestID").innerHTML = "<h3>ID = " + text + "</h3>"
        } else {
            let price = await contract.priceTreatment(await contract.numTicket(account))
            let doct = await contract.getDoctor(await contract.numTicket(account))
            let desc = await contract.getDescription(await contract.numTicket(account))
            document.getElementById("doctorResponse").innerHTML = "<p>Doctor:</p><p>" + doct + "</p><p>Description:</p><p>" + desc + "</p><h3>Price: " + price + " ETH</h3>"
            diagnosed.style.display = "block";
        }
    })
    console.log("Metamask connected")
})

//Request treatment
const requestButton = document.getElementById("requestButton")
requestButton.onclick = requestt

async function requestt(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractHospital, abiHospital, signer)
        await contract.requestTreatment()
    } else {
        console.log("No metamask")
    }
}

//Pay treatment         //ARREGLAR
const payButton = document.getElementById("payButton")
payButton.onclick = payt

async function payt(){
    if (typeof window.ethereum !== "undefined") {
        let account
        window.ethereum.request({ method: "eth_requestAccounts" }).then(async accounts => {
            account = accounts[0]
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractODAFS, abi, signer)
            const contract1 = new ethers.Contract(contractHospital, abiHospital, signer)
            const id = await contract1.numTicket(account)
            var ta2 = document.getElementById("note");
            var nota = ta2.value;
            await contract.payHospital(contractHospital, id, nota)
        
        })
    } else {
        console.log("No metamask")
    }
}

//Donation treatment    //ARREGLAR
const donationButton = document.getElementById("donationButton")
donationButton.onclick = byDonation

async function byDonation(){
    if (typeof window.ethereum !== "undefined") {
        let account
        window.ethereum.request({ method: "eth_requestAccounts" }).then(async accounts => {
            account = accounts[0]
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractODAFS, abi, signer)
            const contract1 = new ethers.Contract(contractHospital, abiHospital, signer)
            const id = await contract1.numTicket(account)
            var ta2 = document.getElementById("note");
            var nota = ta2.value;
            await contract.donateHospital(contractHospital, id, nota)
        })
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
