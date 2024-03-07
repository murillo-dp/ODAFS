const { network,deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert,expect } = require("chai")


describe("ODAFS", async function () {

    let ballot
    let deployer

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["odafs"])
        ballot = await ethers.getContract("ODAFS", deployer)
    })

    describe("Money", async function () {
        
        it("Balance", async function () {
            await ballot.toMember({ value: ethers.utils.parseEther("7") })
            await ballot.toMember({ value: ethers.utils.parseEther("7") })
            const balance = await ballot.balance()
            assert.operator(balance.toString(), '>', 0)
        })
    })

    describe("Money Management", async function () {
        
        it("Monthly Payment, not enought ether", async function () {
            const accounts = await ethers.getSigners()
            const vaultConnectedContract = await ballot.connect(
                accounts[1]
            )
            await vaultConnectedContract.toMember({ value: ethers.utils.parseEther("7") })
            await expect(vaultConnectedContract.toMember({ value: ethers.utils.parseEther("1") })).to.be.revertedWith(
                "Not enough ether"
            )
        })

        it("Correct Monthly Payment", async function () {
            const accounts = await ethers.getSigners()
            const vaultConnectedContract = await ballot.connect(
                accounts[1]
            )
            await vaultConnectedContract.toMember({ value: ethers.utils.parseEther("7") })
            await vaultConnectedContract.toMember({ value: ethers.utils.parseEther("8") })
            const newBalance = await vaultConnectedContract.balance()
            assert.operator(newBalance.toString(), '>', 0)
        })
    })
    
    describe("Proposal Number", async function () {
        
        it("Initial Proposal", async function () {
            const response = await ballot.last()
            assert.equal(response.toString(), "0")
        })
        it("Second Proposal", async function () {
            const accounts = await ethers.getSigners()
            const ballotConnectedContract = await ballot.connect(
                accounts[1]
            )
            await ballotConnectedContract.toMember({ value: ethers.utils.parseEther("4") })
            await ballotConnectedContract.addProposal()
            const response = await ballot.last()
            assert.equal(response.toString(), "1")
        })
        it("Must be member to add proposal", async function () {
            const accounts = await ethers.getSigners()
            const ballotConnectedContract = await ballot.connect(
                accounts[2]
            )
            await expect(ballotConnectedContract.addProposal()).to.be.revertedWith(
                "Not member"
            )
        })
    })

    describe("Control user votes",async function () {
        
        it("User makes first vote", async function () {
            const accounts = await ethers.getSigners()
            const ballotConnectedContract = await ballot.connect(
                accounts[1]
            )
            await expect(ballotConnectedContract.voteInLast(true)).to.not.revertedWith(
                "Already voted"
            )
        })

        it("Check if user has voted", async function () {
            const accounts = await ethers.getSigners()
            const ballotConnectedContract = await ballot.connect(
                accounts[1]
            )
            await ballotConnectedContract.toMember({ value: ethers.utils.parseEther("4") })
            await ballotConnectedContract.addProposal()
            await ballotConnectedContract.voteInLast(true)
            const hasVoted = await ballotConnectedContract.addressHasVoted(accounts[1].address)
            assert.equal(hasVoted.toString(), "true")
        })

        it("User tries to make second vote", async function () {
            const accounts = await ethers.getSigners()
            const ballotConnectedContract = await ballot.connect(
                accounts[1]
            )
            await ballotConnectedContract.toMember({ value: ethers.utils.parseEther("4") })
            await ballotConnectedContract.addProposal()
            await ballotConnectedContract.voteInLast(true)
            await expect(ballotConnectedContract.voteInLast(true)).to.be.revertedWith(
                "Already voted"
            )
        })
    })

    describe("Voting simulation",async function () {
        
        it("Proposal Accepted", async function () {
            const accounts = await ethers.getSigners()
            for (i = 0; i < 10; i++) {
                const ballotConnectedContract = await ballot.connect(
                    accounts[i]
                )
                await ballotConnectedContract.toMember({ value: ethers.utils.parseEther("4") })
                if (i == 0) {
                    await ballotConnectedContract.addProposal()
                }
                if (i < 7) {
                    await ballotConnectedContract.voteInLast(true)
                } else {
                    await ballotConnectedContract.voteInLast(false)
                }
            }
            const response = await ballot.result()
            assert.equal(response.toString(), "true")
        })

        it("Proposal Denied", async function () {
            const accounts = await ethers.getSigners()
            for (i = 0; i < 10; i++) {
                const ballotConnectedContract = await ballot.connect(
                    accounts[i]
                )
                await ballotConnectedContract.toMember({ value: ethers.utils.parseEther("4") })
                if (i == 0) {
                    await ballotConnectedContract.addProposal()
                }
                if (i<7) {
                    await ballotConnectedContract.voteInLast(false)
                } else {
                    await ballotConnectedContract.voteInLast(true)
                }
            }
            const response = await ballot.result()
            assert.equal(response.toString(), "false")
        })

        it("Proposal Results", async function () {
            const accounts = await ethers.getSigners()
            for (i = 0; i < 10; i++) {
                const ballotConnectedContract = await ballot.connect(
                    accounts[i]
                )
                await ballotConnectedContract.toMember({ value: ethers.utils.parseEther("4") })
                if (i == 0) {
                    await ballotConnectedContract.addProposal()
                }
                if (i<7) {
                    await ballotConnectedContract.voteInLast(false)
                } else {
                    await ballotConnectedContract.voteInLast(true)
                }
            }
            const [ numAccept,numDenied ] = await ballot.progress()
            assert.equal(numAccept.toString(), "3")
            assert.equal(numDenied.toString(), "7")
        })

        it("Old Proposal Result", async function () {
            const accounts = await ethers.getSigners()
            for (i = 0; i < 10; i++) {
                const ballotConnectedContract = await ballot.connect(
                    accounts[i]
                )
                await ballotConnectedContract.toMember({ value: ethers.utils.parseEther("4") })
                if (i == 0) {
                    await ballotConnectedContract.addProposal()
                }
                if (i<7) {
                    await ballotConnectedContract.voteInLast(false)
                } else {
                    await ballotConnectedContract.voteInLast(true)
                }
            }
            //await ballot.addProposal()
            for (i = 0; i < 10; i++) {
                const ballotConnectedContract = await ballot.connect(
                    accounts[i]
                )
                if (i == 0) {
                    await ballotConnectedContract.addProposal()
                }
                if (i<7) {
                    await ballotConnectedContract.voteInLast(true)
                } else {
                    await ballotConnectedContract.voteInLast(false)
                }
            }
            
            const oldResult = await ballot.resultOf(1)
            const newResult = await ballot.resultOf(2)

            assert.equal(oldResult.toString(), "false")
            assert.equal(newResult.toString(), "true")
        })
    })

    describe("Vault",async function () {
        
        it("Contract Interaction", async function () {
            const vaultbalance = await ballot.balance()
            assert.equal(vaultbalance.toString(), "0")
        })
    })

    describe("Use vault's money",async function () {
        
        /*
        it("Pay treatment", async function () {
            
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["hospital"])
            hospital = await ethers.getContract("Hospital", deployer)
            
            const accounts = await ethers.getSigners()
            const patientContract = await hospital.connect(
            accounts[1]
            )
            await patientContract.requestTreatment()
            const state = await hospital.treatmentStatus(0)
            //assert.equal(state.toString(), "1")
            //
            const doctorContract = await hospital.connect(
            accounts[2]
            )
            await hospital.newDoctor(accounts[2].address, 1, "Asier", "Murillo")
            await doctorContract.diagnosePatient(0, 10000, "Appendicitis")
            const state1 = await hospital.treatmentStatus(0)
            //assert.equal(state1.toString(), "2")
            
            await ballot.toMember({ value: ethers.utils.parseEther("4") })
            await ballot.payHospital(hospital.address, 0, 7)
            const state2 = await ballot.last()
            assert.equal(state2.toString(), "3")
        })*/

        it("Buy in pharmacy", async function () {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["pharmacy"])
            pharmacy = await ethers.getContract("Pharmacy", deployer)

            await pharmacy.addProduct("Dalsy","Child medicine", ethers.utils.parseEther("1"))
            await pharmacy.addStock(0,20)
            await ballot.toMember({ value: ethers.utils.parseEther("4") })
            await ballot.payPharmacy(pharmacy.address, 0, 3)
            const products = await pharmacy.productStock(0)
            assert.equal(products.toString(), "17")
        })
    })

})