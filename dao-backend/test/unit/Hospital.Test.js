const { network,deployments, ethers, getNamedAccounts} = require("hardhat")
const { assert,expect } = require("chai")

describe("Hospital", async function () {

    let hospital
    let deployer

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["hospital"])
        hospital = await ethers.getContract("Hospital", deployer)
    })

    describe("Ranks", async function () {
        
        it("Hospital Owner", async function () {
            const owner = await hospital.owner()
            assert.equal(owner.toString(), deployer.toString())
        })

        it("Not doctor", async function () {
            const response = await hospital.isDoctor(deployer)
            assert.equal(response.toString(), "false")
        })

        it("Doctor", async function () {
            await hospital.newDoctor(deployer, 1, "Inaki", "Murillo","rutaFoto")
            const response = await hospital.isDoctor(deployer)
            assert.equal(response.toString(), "true")
        })
    })

    describe("Treatments", async function () {
        
        it("Treatment Process", async function () { 
            const accounts = await ethers.getSigners()
            const patientContract = await hospital.connect(
                accounts[1]
            )
            await patientContract.requestTreatment()
            const state = await hospital.treatmentStatus(0)
            assert.equal(state.toString(), "1")
            //
            const doctorContract = await hospital.connect(
                accounts[2]
            )
            await hospital.newDoctor(accounts[2].address, 1, "Asier", "Murillo","rutaFoto")
            await doctorContract.diagnosePatient(0, 10000, "Appendicitis")
            const state1 = await hospital.treatmentStatus(0)
            assert.equal(state1.toString(), "2")
            //
            await patientContract.payTreatment(0, 4,{ value: ethers.utils.parseEther("1") })
            const state2 = await hospital.treatmentStatus(0)
            assert.equal(state2.toString(), "3")
            //
        })

    })
})