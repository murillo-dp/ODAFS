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

//Send donation
const sendDonation = document.getElementById("sendDonation")
sendDonation.onclick = donation
async function donation(){
    const ethAmount = document.getElementById("amount").value
    console.log(`Donate ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.enable()
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractODAFS, abi, signer)
            const transactionResponse = await contract.fallback({
              value: ethers.utils.parseEther(ethAmount),
            })
      
            await transactionResponse.wait()
            console.log("Donation successful!")
          } catch (error) {
            console.error("Error:", error)
          }
    } else {
        console.log("No metamask")
    }
}


//Check if wallet connected
const isMetaMaskConnected = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
}
await isMetaMaskConnected().then((connected) => {
    if (connected) {
        document.getElementById("connectWalletButton").click()
    }
})

// Vault's Pie chart
let reserveInEther
let reserveInEther1
if (typeof window.ethereum !== "undefined") {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractODAFS, abi, signer)
    const reserve = await contract.balance()
    reserveInEther = ethers.utils.formatEther(reserve)
    console.log(reserveInEther)
    const charReserve = await contract.solidaryBalance()
    reserveInEther1 = ethers.utils.formatEther(charReserve)
    console.log(reserveInEther1)
} else {
    console.log("No Metamask")
}

const pieData = {
    labels: ["ODAFS reserves", "Charity reserves"],
    data: [reserveInEther, reserveInEther1],
}
const myPie = document.querySelector(".my-pie")
const ul  = document.querySelector(".vault-money .details ul")
new Chart(myPie, {
    type: "doughnut",
    data: {
        labels: pieData.labels,
        datasets: [
            {
                label: " ETH",
                data: pieData.data,
            },
        ],
    },
    options: {
        borderWidth: 10,
    },
})
const createUl = () => {
    pieData.labels.forEach((l, i) => {
        let li = document.createElement("li")
        li.innerHTML = `${l}: <span>${pieData.data[i]} ETHER</span>`
        ul.appendChild(li)
    })
}

createUl()
