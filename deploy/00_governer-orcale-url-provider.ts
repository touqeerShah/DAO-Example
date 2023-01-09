import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { ORCALE_URL_PROVIDER } from "./../helper-hardhat-config"

const deployOrcaleUrlProvider: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    log("Deploying Orcale Url Provider Contract .... ")
    const orcaleUrlProvider = await deploy("OrcaleUrlProvider", {
        from: deployer,
        args: [ORCALE_URL_PROVIDER],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
        proxy: {
            proxyContract: "OpenZeppelinTransparentProxy",
            viaAdminContract: {
                name: "OrcaleUrlProviderProxy",
                artifact: "OrcaleUrlProviderProxy",
            },
        },
    })
    log(`OrcaleUrlProvider at ${orcaleUrlProvider.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(orcaleUrlProvider.address, [])
    }

}

export default deployOrcaleUrlProvider
deployOrcaleUrlProvider.tags = ["all", "oup", "orcale"];