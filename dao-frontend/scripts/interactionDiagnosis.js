import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractODAFS, contractHospital, abiHospital } from "./constants.js"

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

//Diagnose
const sendButton = document.getElementById("send")
sendButton.onclick = sendt

async function sendt(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractHospital, abiHospital, signer)
        var ta1 = document.getElementById("id");
        var t1 = ta1.value;
        var ta2 = document.getElementById("diagnosis");
        var t2 = ta2.value;
        var ta3 = document.getElementById("price");
        var t3 = ethers.utils.parseEther(ta3.value);
        await contract.diagnosePatient(t1, t3, t2)
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