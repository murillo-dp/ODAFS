import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractODAFS } from "./constants.js"

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
