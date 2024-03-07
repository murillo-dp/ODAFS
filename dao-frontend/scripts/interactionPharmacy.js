import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, abiPharmacy, contractODAFS, contractPharmacy } from "./constants.js"

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
const plus = document.querySelector(".plus"),
    minus = document.querySelector(".minus"),
    num = document.querySelector(".num")
let i = 0
let value
plus.addEventListener("click", ()=>{
    if (i < value) {
        i++
        num.innerHTML = i
    }
})
minus.addEventListener("click", ()=>{
    if (i > 1) {
        i--
        num.innerHTML = i
    }
})

async function numProducts() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractPharmacy, abiPharmacy, signer)
            const num = await contract.numOfProducts();
            return num;
        } catch (error) {
            console.error("Error fetching number of products:", error)
        }
    } else {
        console.error("No Ethereum provider found.")
    }
}

//Add new product
const addProductButton = document.getElementById("addProduct")
addProductButton.onclick = addProductt

async function addProductt(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractPharmacy, abiPharmacy, signer)
        var ta1 = document.getElementById("name");
        var t1 = ta1.value;
        var ta2 = document.getElementById("description1");
        var t2 = ta2.value;
        var ta3 = document.getElementById("price");
        var t3 = ethers.utils.parseEther(ta3.value);
        await contract.addProduct(t1, t2, t3)
    } else {
        console.log("No metamask")
    }
}

//Add new product
const addStockButton = document.getElementById("addStock")
addStockButton.onclick = addStockt

async function addStockt(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractPharmacy, abiPharmacy, signer)
        var ta1 = document.getElementById("idt");
        var t1 = ta1.value - 1;
        var ta2 = document.getElementById("amount");
        var t2 = ta2.value;
        await contract.addStock(t1, t2)
    } else {
        console.log("No metamask")
    }
}

//Buy product
const buyButton = document.getElementById("buyButton")
buyButton.onclick = buyt

async function buyt(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractODAFS, abi, signer)
        var ta1 = document.getElementById("cant");
        var t1 = ta1.value;
        await contract.payPharmacy(contractPharmacy, i - 1, t1)
    } else {
        console.log("No metamask")
    }
}

//Donate product
const donateButton = document.getElementById("donateButton")
donateButton.onclick = donatet

async function donatet(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractODAFS, abi, signer)
        var ta1 = document.getElementById("cant");
        var t1 = ta1.value;
        await contract.donatePharmacy(contractPharmacy, i - 1, t1)
    } else {
        console.log("No metamask")
    }
}

//See results
const productButton = document.getElementById("productButton")
productButton.onclick = toProduct
async function toProduct(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractPharmacy, abiPharmacy, signer)
        const name = await contract.productName(i - 1)
        const description = await contract.productDescription(i - 1)
        const price = (await contract.productPrice(i - 1) / 1000000000000000000) + ' ETH/Unit'
        const amount = await contract.productStock(i - 1) + ' in stock'
        let text = "<h3>-Product " + i + ": " + name + "</h3>"
        text = text + description + "<br>" + price + "<br>" + amount + "<br>" 
        document.getElementById("resultP").innerHTML = text
    } else {
        console.log("No metamask")
    }
}

//Check if wallet connected && get number of last proposal
const isMetaMaskConnected = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.listAccounts()
    return accounts.length > 0;
}
(async () => {
    const connected = await isMetaMaskConnected();
    if (connected) {
        document.getElementById("connectWalletButton").click();
        const proposal = await numProducts()
        value = parseInt(proposal)
        document.getElementById("numProd").textContent = value.toString()
    }
})();