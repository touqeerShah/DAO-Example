import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    log("Deploying Governer Token Contract .... ")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [ethers.utils.parseEther("100000")],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`GovernanceToken at ${governanceToken.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governanceToken.address, [])
    }
    log(`Delegating to ${deployer}`)
    await delegate(governanceToken.address, deployer)
    log("Delegated!")
}

async function delegate(address: string, deployer: string) {
    const token = await ethers.getContractAt("GovernanceToken", address)
    const tx = await token.delegate(deployer)
    await tx.wait(1)
    console.log(`Checkpoints: ${await token.numCheckpoints(deployer)}`)


}
export default deployGovernanceToken
deployGovernanceToken.tags = ["all", "governor"];