import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractODAFS } from "./constants.js"


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

//Add new proposal
const addProposalButton = document.getElementById("addProposalButton")
addProposalButton.onclick = addProposal

async function addProposal(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractODAFS, abi, signer)
        var textarea1 = document.getElementById("receiver");
        var text1 = textarea1.value;
        var textarea2 = document.getElementById("amount");
        var text2 = ethers.utils.parseEther(textarea2.value);
        var textarea3 = document.getElementById("description");
        var text3 = textarea3.value;
        const transactionResponse = await contract.addSendProposalD(text1, text2, text3)
    } else {
        console.log("No metamask")
    }
}

//Vote
const voteButton = document.getElementById("voteButton")
voteButton.onclick = toVote
async function toVote(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractODAFS, abi, signer)
        var selectedOption = (document.querySelector('input[name="option"]:checked').value === 'true')
        const transactionResponse = await contract.vote(selectedOption,i)
    } else {
        console.log("No metamask")
    }
}


//See results
const resultButton = document.getElementById("resultButton")
resultButton.onclick = toResult
async function toResult(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractODAFS, abi, signer)
        const descriptionResponse = await contract.descriptionOf(i)
        const favorResponse = await contract.inFavorOf(i)
        const againstResponse = await contract.againstOf(i)
        const receiverResponse = await contract.receiverOf(i)
        const amountResponse = (await contract.amountOf(i) / 1000000000000000000)
        let text = "<h3>-Proposal n." + i + "</h3>"
        text = text + "<p>" + receiverResponse + "</p>"
        text = text + amountResponse + " ETH<br>"
        text = text + descriptionResponse + "<br>"

        const ctx = document.getElementById('voteChart').getContext('2d');
        if (window.voteChartInstance) {
            window.voteChartInstance.destroy();
        }
        window.voteChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['In Favor', 'Against'],
                datasets: [{
                    data: [parseInt(favorResponse), parseInt(againstResponse)],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                }]
            }
        });

        document.getElementById("result").innerHTML = text
    } else {
        console.log("No metamask")
    }
}


async function actualProposal() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractODAFS, abi, signer)
            const num = await contract.last();
            return num;
        } catch (error) {
            console.error("Error fetching actual proposal:", error)
        }
    } else {
        console.error("No Ethereum provider found.")
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
        const proposal = await actualProposal()
        value = parseInt(proposal)
        document.getElementById("numProposals").textContent = value.toString()
    }
})();