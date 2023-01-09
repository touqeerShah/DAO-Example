import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains, SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION, NFT_NAME, NFT_SYMBOL } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployUserIdentityNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log, get } = deployments
    let { deployer, } = await getNamedAccounts();
    let figureprintOracle = await get("FigurePrintOracle");
    log("figureprintOracle === ", figureprintOracle.address)

    log("Deploying User Identity NFT  Contract .... ")
    const UserIdentityNFT = await deploy("UserIdentityNFT", {
        from: deployer,
        args: [figureprintOracle.address, NFT_NAME, NFT_SYMBOL, SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`UserIdentityNFT at ${UserIdentityNFT.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(UserIdentityNFT.address, [])
    }

}


export default deployUserIdentityNFT
deployUserIdentityNFT.tags = ["all", "userIdentityNFT", "orcale"];