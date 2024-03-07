const { network,deployments, ethers, getNamedAccounts} = require("hardhat")
const { assert,expect } = require("chai")

describe("Pharmacy", async function () {

    let pharmacy
    let deployer

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["pharmacy"])
        pharmacy = await ethers.getContract("Pharmacy", deployer)
    })

    describe("Ownership", async function () {
        
        it("Owner", async function () {
            const owner = await pharmacy.owner()
            assert.equal(owner.toString(), deployer.toString())
        })

        it("Owner can change inventory", async function () {
            await expect(pharmacy.addProduct("Dalsy","Child medicine",100)).to.not.be.revertedWith(
                "You are not the owner"
            )
        })

        it("Only owner can change inventory", async function () {
            const accounts = await ethers.getSigners()
            const pharmacyConnectedContract = await pharmacy.connect(
                accounts[1]
            )
            await expect(pharmacyConnectedContract.addProduct("Dalsy","Big bottle",100)).to.be.revertedWith(
                "You are not the owner"
            )
        })
    })

    describe("Inventory", async function () {
        
        beforeEach(async function () {
            await pharmacy.addProduct("Dalsy","Child medicine",500)
            await pharmacy.addProduct("Paracetamol","500mg",10000)
        })

        it("Add products", async function () {
            await pharmacy.addProduct("Painkillers","Very soft",9000)
            const products = await pharmacy.numOfProducts()
            assert.equal(products.toString(), "3")
        })

        it("Add stock", async function () {
            await pharmacy.addStock(1,7)
            const products = await pharmacy.productStock(1)
            assert.equal(products.toString(), "7")
        })
    })

    describe("Buy", async function () {
        
        beforeEach(async function () {
            await pharmacy.addProduct("Dalsy","Child medicine",500)
            await pharmacy.addStock(0,20)
            await pharmacy.addProduct("Paracetamol","500mg",10000)
        })

        it("Buy Product", async function () {
            const accounts = await ethers.getSigners()
            const pharmacyConnectedContract = await pharmacy.connect(
                accounts[1]
            )
            await pharmacyConnectedContract.buy( 0,3,{ value: ethers.utils.parseEther("4") })
            const products = await pharmacy.productStock(0)
            assert.equal(products.toString(), "17")
        })

        it("Try to buy product with no stock", async function () {
            const accounts = await ethers.getSigners()
            const pharmacyConnectedContract = await pharmacy.connect(
                accounts[1]
            )
            await expect(pharmacyConnectedContract.buy( 1,3,{ value: ethers.utils.parseEther("4") })).to.be.revertedWith(
                "Not enought stock"
            )
        })
    })

})