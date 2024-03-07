//const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //const chainId = network.config.chainId

    const hospital = await deploy("Hospital", {
        from: deployer,
        args: [],
        log: true,
    })
    log(`Hospital deployed at ${hospital.address}`)
}

module.exports.tags = ["all", "hospital"]