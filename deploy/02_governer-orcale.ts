import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction, DeployResult } from "hardhat-deploy/types"
import { getStringToBytes } from "../utils/convert"
import verify from "../instructions/verify-code"
import { networkConfig, developmentChains, JOB_ID, contractAddressFile } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { storeProposalId } from "../utils/storeContractAddress"
import { getOrcaleUrlProvider, getUserIdentityNFT } from "../instructions"

const deployFigurePrintOracle: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    let orcaleUrlProvider = await getOrcaleUrlProvider();
    let userIdentityNFT = await getUserIdentityNFT();

    console.log("orcaleUrlProvider.address", orcaleUrlProvider.address);
    console.log("userIdentityNFT.address", userIdentityNFT.address);

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
    log("networkConfig[network.name]", networkConfig[network.name])
    let args: any[] = [
        networkConfig[network.name].linkToken,
        networkConfig[network.name].oricle,
        getStringToBytes(JOB_ID),
        ethers.utils.parseEther("0.1"),
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
    let tx = await userIdentityNFT.setFingerPrintAddress(figurePrintOracle.address)
    await tx.wait(1)
    log(`figurePrintOracle at ${figurePrintOracle.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCANAPIKEY) {
        await verify(figurePrintOracle.address, args)
    }

}

export default deployFigurePrintOracle
deployFigurePrintOracle.tags = ["all", "fpo", "orcale"];