import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains, MIN_DELAY, ADDRESS_ZERO } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    log("Deploying Time Lock  Contract .... ")
    const TimeLock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], [], ADDRESS_ZERO],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`Time Lock at ${TimeLock.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(TimeLock.address, [])
    }

}


export default deployTimeLock
deployTimeLock.tags = ["all", "timelock"];