import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains, MIN_DELAY, ADDRESS_ZERO } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    log("Deploying Box  Contract .... ")
    const Box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    let timelock = await ethers.getContract("TimeLock")
    let boxContract = await ethers.getContract("Box")
    let tx = await boxContract.transferOwnership(timelock.address)
    await tx.wait(1)
    log(`Box at ${Box.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(Box.address, [])
    }

}


export default deployBox
deployBox.tags = ["all", "box"];