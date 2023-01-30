import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction, DeployResult } from "hardhat-deploy/types"
import { getStringToBytes } from "../utils/convert"
import verify from "../instructions/verify-code"
import { networkConfig, developmentChains, JOB_ID, contractAddressFile } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { storeProposalId } from "./../utils/storeContractAddress"

const deployFigurePrintOracle: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    let orcaleUrlProvider = await ethers.getContractAt("OrcaleUrlProvider", deployer);
    let chainToken: DeployResult;
    let orcale: DeployResult;
    if (network.name != "goerli") {
        log("Deployment on Mock Contracr... ")

        chainToken = await deploy("LinkToken", {
            from: deployer,
            args: [],
            log: true,
            // we need to wait if on a live network so we can verify properly
            waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
        })
        log("Deploying chain Token Contract .... ", chainToken.address)
        await storeProposalId(chainToken.address, "LinkToken", contractAddressFile)

        networkConfig[network.name].linkToken = chainToken.address;
        orcale = await deploy("MockOracle", {
            from: deployer,
            args: [chainToken.address],
            log: true,
            // we need to wait if on a live network so we can verify properly
            waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
        })
        log("Deploying orcale Contract .... ", orcale.address)
        networkConfig[network.name].oricle = orcale.address;
        await storeProposalId(orcale.address, "MockOracle", contractAddressFile)


    }

    log("Deploying Figure Print Oracle Contract .... ")

    let args: any[] = [
        networkConfig[network.name].linkToken,
        networkConfig[network.name].oricle,
        getStringToBytes(JOB_ID),
        ethers.utils.parseEther("1"),
        orcaleUrlProvider.address
    ]


    log(args)
    const figurePrintOracle = await deploy("FigurePrintOracle", {
        from: deployer,
        args: args,
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    await storeProposalId(figurePrintOracle.address, "FigurePrintOracle", contractAddressFile)

    log(`figurePrintOracle at ${figurePrintOracle.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(figurePrintOracle.address, [])
    }

}

export default deployFigurePrintOracle
deployFigurePrintOracle.tags = ["all", "fpo", "orcale"];