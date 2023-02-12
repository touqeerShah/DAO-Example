import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../instructions/verify-code"
import { networkConfig, developmentChains, contractAddressFile } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { ORCALE_URL_PROVIDER } from "../helper-hardhat-config"
import { storeProposalId } from "../utils/storeContractAddress"

const deployOrcaleUrlProvider: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    log("Deploying Orcale Url Provider Contract .... ", ORCALE_URL_PROVIDER)
    const orcaleUrlProvider = await deploy("OrcaleUrlProvider", {
        from: deployer,
        args: [ORCALE_URL_PROVIDER],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
        // proxy: {
        //     proxyContract: "OpenZeppelinTransparentProxy",
        //     viaAdminContract: {
        //         name: "OrcaleUrlProviderAdmin",
        //         artifact: "OrcaleUrlProviderAdmin",
        //     },
        // },
    })

    await storeProposalId(orcaleUrlProvider.address, "OrcaleUrlProvider", contractAddressFile)
    // let orcaleUr = await ethers.getContractAt("OrcaleUrlProvider_Proxy", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
    // let proxyBox = await ethers.getContractAt("OrcaleUrlProvider", orcaleUr.address)// let url = await orcaleUr.getURL()
    // // console.log("url => ", await proxyBox.g÷tURL());
    // console.log("orcaleUr", proxyBox.address);

    log(`OrcaleUrlProvider at ${orcaleUrlProvider.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(orcaleUrlProvider.address, [])
    }

}

export default deployOrcaleUrlProvider
deployOrcaleUrlProvider.tags = ["all", "oup", "orcale"];