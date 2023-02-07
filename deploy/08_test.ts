import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../instructions/verify-code"
import { networkConfig, developmentChains, SIGNING_DOMAIN_NAME, contractAddressFile, SIGNING_DOMAIN_VERSION, NFT_NAME, NFT_SYMBOL } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { storeProposalId } from "../utils/storeContractAddress"
import { getFigurePrintOracle } from "../instructions"

const deployUserIdentityNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log, get } = deployments
    let { deployer, } = await getNamedAccounts();
    let figureprintOracle = await getFigurePrintOracle();
    log("figureprintOracle === ", figureprintOracle.address)

    log("Deploying User Identity NFT  Contract .... ")
    const PTNFT = await deploy("PTNFT", {
        from: deployer,
        args: [figureprintOracle.address, NFT_NAME, NFT_SYMBOL, SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    await storeProposalId(PTNFT.address, "PTNFT", contractAddressFile)

    log(`PTNFT at ${PTNFT.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCANAPIKEY) {
        await verify(PTNFT.address, [figureprintOracle.address, NFT_NAME, NFT_SYMBOL, SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION])
    }

}


export default deployUserIdentityNFT
deployUserIdentityNFT.tags = ["all", "PTNFT", "orcale"];