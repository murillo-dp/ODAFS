//const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //const chainId = network.config.chainId

    const ballot = await deploy("ODAFS", {
        from: deployer,
        args: [],
        log: true,
    })
    log(`ODAFS deployed at ${ballot.address}`)
}

module.exports.tags = ["all", "odafs", "vault", "member"]