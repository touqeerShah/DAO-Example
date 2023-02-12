import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../instructions/verify-code"
import { networkConfig, developmentChains, DS_SIGNING_DOMAIN_NAME, contractAddressFile, DS_SIGNING_DOMAIN_VERSION, DS_NFT_NAME, DS_NFT_SYMBOL } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { storeProposalId } from "../utils/storeContractAddress"

const deployDocumentSignature: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log, get } = deployments
    let { deployer, } = await getNamedAccounts();
    let userIdentityNFT = await get("UserIdentityNFT");
    log("figureprintOracle === ", userIdentityNFT.address)

    log("Deploying Document Voting Contract .... ")
    const DocumentSignature = await deploy("DocumentSignature", {
        from: deployer,
        args: [userIdentityNFT.address, DS_NFT_NAME, DS_NFT_SYMBOL, DS_SIGNING_DOMAIN_NAME, DS_SIGNING_DOMAIN_VERSION],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    await storeProposalId(DocumentSignature.address, "DocumentSignature", contractAddressFile)

    log(`DocumentSignature at ${DocumentSignature.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(DocumentSignature.address, [])
    }

}


export default deployDocumentSignature
deployDocumentSignature.tags = ["all", "developmentChains", "orcale"];