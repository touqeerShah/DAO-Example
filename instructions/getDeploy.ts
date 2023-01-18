import { BigNumber } from "ethers";
import { artifacts, ethers } from "hardhat";
import { contractAddressFile } from "../helper-hardhat-config"
import * as fs from "fs";
import { OrcaleUrlProvider, GovernorContract, FigurePrintOracle, UserIdentityNFT, DocumentSignature, TimeLock } from "../typechain-types"

export async function getOrcaleUrlProvider(): Promise<OrcaleUrlProvider> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let orcaleUrlProvider = await ethers.getContractAt("OrcaleUrlProvider", contractAddress["OrcaleUrlProvider"]);
  return orcaleUrlProvider;
}
export async function getFigurePrintOracle(): Promise<FigurePrintOracle> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let figurePrintOracle = await ethers.getContractAt("FigurePrintOracle", contractAddress["FigurePrintOracle"]);
  return figurePrintOracle;
}
export async function getUserIdentityNFT(): Promise<UserIdentityNFT> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let userIdentityNFT = await ethers.getContractAt("UserIdentityNFT", contractAddress["UserIdentityNFT"]);
  return userIdentityNFT;
}
export async function getDocumentSignature(): Promise<DocumentSignature> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let documentSignature = await ethers.getContractAt("DocumentSignature", contractAddress["DocumentSignature"]);
  return documentSignature;
}
export async function getTimeLock(): Promise<TimeLock> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let timeLock = await ethers.getContractAt("TimeLock", contractAddress["TimeLock"]);
  return timeLock;
}
export async function getGovernorContract(): Promise<GovernorContract> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let governorContract = await ethers.getContractAt("GovernorContract", contractAddress["GovernorContract"]);
  return governorContract;
}