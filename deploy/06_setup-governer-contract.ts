import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { contractAddressFile, ADDRESS_ZERO } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import * as fs from "fs";

const deploySetupGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { deployments, getNamedAccounts } = hre
    let { log, get } = deployments
    let { deployer } = await getNamedAccounts();
    let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))

    let timelock = await ethers.getContractAt("TimeLock", contractAddress["TimeLock"]);
    let goveror = await ethers.getContractAt("GovernorContract", contractAddress["GovernorContract"]);

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