import { ethers } from "hardhat";
import { NEW_STORE_VALUE, FUNC } from "../helper-hardhat-config"
async function propose(args: number[], functionCall: string) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");
  const encodeFunctionCall = box.interface.encodeFunctionData(
    functionCall, args
  )
  console.log("encodeFunctionCall = >", encodeFunctionCall);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
propose([NEW_STORE_VALUE], FUNC).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
