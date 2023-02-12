import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { getOrcaleUrlProvider, getTimeLock } from "../instructions"

const deployOrcaleUrlProvider: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    log("Setup Orcale Url Provider  Contract .... ")

    let timelock = await getTimeLock()
    let orcaleUrlProviderContract = await getOrcaleUrlProvider()
    let tx = await orcaleUrlProviderContract.transferOwnership(timelock.address)
    await tx.wait(1)
    log(`OrcaleUrlProvider at ${orcaleUrlProviderContract.address}`)


}

export default deployOrcaleUrlProvider
deployOrcaleUrlProvider.tags = ["all", "changeOwnerShip"];