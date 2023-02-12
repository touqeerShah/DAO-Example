import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../instructions/verify-code"
import { networkConfig, developmentChains, SIGNING_DOMAIN_NAME, contractAddressFile, SIGNING_DOMAIN_VERSION, NFT_NAME, NFT_SYMBOL } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { storeProposalId } from "../utils/storeContractAddress"

const deployUserIdentityNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log, get } = deployments
    let { deployer, } = await getNamedAccounts();

    log("Deploying User Identity NFT  Contract .... ")
    log(deployer)
    const UserIdentityNFT = await deploy("UserIdentityNFT", {
        from: deployer,
        args: [NFT_NAME, NFT_SYMBOL, SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    await storeProposalId(UserIdentityNFT.address, "UserIdentityNFT", contractAddressFile)
    await delegate(UserIdentityNFT.address, deployer)

    log(`UserIdentityNFT at ${UserIdentityNFT.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCANAPIKEY) {
        await verify(UserIdentityNFT.address, [NFT_NAME, NFT_SYMBOL, SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION])
    }

}


async function delegate(address: string, deployer: string) {
    const token = await ethers.getContractAt("UserIdentityNFT", address)
    const tx = await token.delegate(deployer)
    await tx.wait(1)
    console.log(`Checkpoints: ${await token.getVotes(deployer)}`)
}


export default deployUserIdentityNFT
deployUserIdentityNFT.tags = ["all", "userIdentityNFT", "orcale"];