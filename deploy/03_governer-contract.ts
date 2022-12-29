import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains, QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD, ADDRESS_ZERO } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log, get } = deployments
    let { deployer, } = await getNamedAccounts();
    let timelock = await get("TimeLock");
    let token = await get("GovernanceToken");
    log("timelock === ", timelock.address)
    log("token === ", token.address)

    log("Deploying Goveror  Contract .... ")
    const GovernorContract = await deploy("GovernorContract", {
        from: deployer,
        args: [token.address, timelock.address, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`Goveror at ${GovernorContract.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(GovernorContract.address, [])
    }

}


export default deployGovernorContract
deployGovernorContract.tags = ["all", "governorcontract"];