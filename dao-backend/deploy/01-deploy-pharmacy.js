//const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //const chainId = network.config.chainId

    const pharmacy = await deploy("Pharmacy", {
        from: deployer,
        args: [],
        log: true,
    })
    log(`Pharmacy deployed at ${pharmacy.address}`)
}

module.exports.tags = ["all", "pharmacy"]