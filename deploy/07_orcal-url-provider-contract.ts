import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains, MIN_DELAY, ADDRESS_ZERO } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployOrcaleUrlProvider: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    log("Setup Orcale Url Provider  Contract .... ")

    let timelock = await ethers.getContractAt("TimeLock", deployer)
    let orcaleUrlProviderContract = await ethers.getContractAt("OrcaleUrlProvider", deployer)
    let tx = await orcaleUrlProviderContract.transferOwnership(timelock.address)
    await tx.wait(1)
    log(`OrcaleUrlProvider at ${orcaleUrlProviderContract.address}`)


}

export default deployOrcaleUrlProvider
deployOrcaleUrlProvider.tags = ["all", "box"];