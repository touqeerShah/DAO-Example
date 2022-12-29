import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains, QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD, ADDRESS_ZERO } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deploySetupGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log, get } = deployments
    let { deployer } = await getNamedAccounts();
    let timelock = await ethers.getContract("TimeLock", deployer);
    let token = await ethers.getContract("GovernanceToken", deployer);
    let goveror = await ethers.getContract("GovernorContract", deployer);

    log("Set-Up Goveror  Contract .... ")
    const proposerRole = await timelock.PROPOSER_ROLE()
    const executorRole = await timelock.EXECUTOR_ROLE()
    const adminRole = await timelock.TIMELOCK_ADMIN_ROLE()
    // here we give permission to the goveror
    const proposerTx = await timelock.grantRole(proposerRole, goveror.address)
    await proposerTx.wait(1)
    // here we said anyone can call execute function once timelock is over
    const executorTx = await timelock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    // here we revoker permission fro deployer and give permission to governer
    const revokeTx = await timelock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)

}


export default deploySetupGovernorContract
deploySetupGovernorContract.tags = ["all", "setup"];