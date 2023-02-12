import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../instructions/verify-code"
import { networkConfig, developmentChains, contractAddressFile, QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD, ADDRESS_ZERO } from "../helper-hardhat-config"

import { storeProposalId } from "./../utils/storeContractAddress"
import { getTimeLock, getUserIdentityNFT } from "../instructions"

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log, get } = deployments
    let { deployer, } = await getNamedAccounts();
    let timelock = await getTimeLock();
    let token = await getUserIdentityNFT();
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
    await storeProposalId(GovernorContract.address, "GovernorContract", contractAddressFile)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(GovernorContract.address, [])
    }

}


export default deployGovernorContract
deployGovernorContract.tags = ["all", "governorcontract"];