import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../instructions/verify-code"
import { networkConfig, developmentChains, MIN_DELAY, contractAddressFile } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { storeProposalId } from "./../utils/storeContractAddress"
const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    log("Deploying Time Lock  Contract .... ")
    const TimeLock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], [], deployer],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`Time Lock at ${TimeLock.address}`)
    const token = await ethers.getContractAt("TimeLock", TimeLock.address)
    const proposerRole = await token.PROPOSER_ROLE()
    await storeProposalId(TimeLock.address, "TimeLock", contractAddressFile)
    log("\nproposerRole", proposerRole)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(TimeLock.address, [])
    }

}


export default deployTimeLock
deployTimeLock.tags = ["all", "timelock"];