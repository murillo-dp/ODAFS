import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractODAFS } from "./constants.js"

//Connect Metamask
document.getElementById("connectWalletButton").addEventListener("click", event => {
    let account
    let button = event.target
    window.ethereum.request({ method: "eth_requestAccounts" }).then(async accounts => {
        account = accounts[0]
        console.log(account)
        button.textContent = account.substring(0, 6) + "..."  

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractODAFS, abi, signer)
        const booli = await contract.isMember(account)
        if (booli) {
            const cadu = await contract.cadu(account)
            document.getElementById("caducidad").innerHTML = "<label>Membership valid until block " + cadu + ". Renew for 4 ETH/month</label>"
        } else {
            document.getElementById("caducidad").innerHTML = "<label>Join us for 4 ETH/month</label>"
        }
    })
    console.log("Metamask connected")
})

//toMember
const toMemberButton = document.getElementById("toMemberButton")
toMemberButton.onclick = toMember

async function toMember(){
    const months = document.getElementById("months").value
    const ethAmount = String((months * 4))
    console.log(`Member with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractODAFS, abi, signer)
        const transactionResponse = await contract.toMember({
            value: ethers.utils.parseEther(ethAmount),
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