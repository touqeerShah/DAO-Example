import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployGovernanceNft: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    log("Deploying Governer Nft Contract .... ")
    const governanceNft = await deploy("GovernanceNFT", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`GovernanceNft at ${governanceNft.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governanceNft.address, [])
    }
    log(`Delegating to ${deployer}`)
    await delegate(governanceNft.address, deployer)
    log("Delegated!")
}

async function delegate(address: string, deployer: string) {
    const token = await ethers.getContractAt("GovernanceNFT", address)
    const tx = await token.delegate(deployer)
    await tx.wait(1)
    console.log(`Checkpoints: ${await token.getVotes(deployer)}`)
}
export default deployGovernanceNft
deployGovernanceNft.tags = ["all", "nft"];