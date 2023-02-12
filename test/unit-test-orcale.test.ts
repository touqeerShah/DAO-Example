import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { LinkToken, FigurePrintOracle, MockOracle } from "../typechain-types";
import { networkConfig, developmentChains, JOB_ID, contractAddressFile } from "../helper-hardhat-config"

import { getLinkToken, getFigurePrintOracle, getMockOracle } from "../instructions"
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { log } from "console";
import { getStringToBytes } from "../utils/convert"
const { network } = require("hardhat")


describe("FigurePrintOracle", async function () {
  let deployer: Signer;
  let deployer2: Signer
  let deployer3: Signer
  let deployer4: Signer

  let linkToken: LinkToken;
  let figurePrintOracle: FigurePrintOracle;
  let oricle: MockOracle;
  let jobId: string;
  let fee: BigNumber;



  before(async () => {
    [deployer, deployer2, deployer3, deployer4] = await ethers.getSigners(); // could also do with getNamedAccounts
    linkToken = await getLinkToken();
    figurePrintOracle = await getFigurePrintOracle();
    // linkTokenAddress = linkToken.address;
    oricle = await getMockOracle();
    jobId = getStringToBytes(JOB_ID);
    fee = ethers.utils.parseEther("0.1");
    console.log("oricle", network.name);


  });

  describe("figurePrint Oracle Test", async function () {
    it("Check figurePrint Oracle Link Balance", async function () {
      let balance = await linkToken.balanceOf(figurePrintOracle.address)
      const ethValue = ethers.utils.formatEther(balance);

      console.log("url => ", ethValue);
      assert.equal(ethValue, "0.0")

    });

    it("Fund figurePrint Oracle with Link", async function () {
      let sendEther: BigNumber = ethers.utils.parseEther("1")

      let tx = await linkToken.transfer(figurePrintOracle.address, sendEther)
      var txReceipt = await tx.wait(1) // waits 1 block

      let balance = await linkToken.balanceOf(figurePrintOracle.address)
      const ethValue = ethers.utils.formatEther(balance);
      console.log("url => ", ethValue);
      assert.equal(ethValue, "1.0")

    });
    it("Check Only Owner Execption", async () => {
      let address = await deployer.getAddress()

      expect(await figurePrintOracle.connect(deployer2).setVeriferRole(address, { gasLimit: 3e6 })).to.revertedWith(
        "Only callable by owner"
      )
    })
    it("Set VeriferRole", async () => {
      let tx = figurePrintOracle.setVeriferRole(await deployer.getAddress());
      (await tx).wait(1)
      let address = await deployer.getAddress()
      const VERIFIER_ROLE = keccak256(toUtf8Bytes("VERIFIER_ROLE"));
      console.log("VERIFIER_ROLE", VERIFIER_ROLE);

      let _isValid: boolean = await figurePrintOracle.hasRole(VERIFIER_ROLE, address)
      console.log("_isValid", _isValid);

      assert.equal(_isValid, true)

    })

    it("Check URL", async () => {
      let URL = await figurePrintOracle.connect(deployer).getBaseURI();
      console.log("URL", URL);
    })
    it("Set Chain LinkToken", async () => {
      await expect(figurePrintOracle.connect(deployer).setChainLinkToken(linkToken.address)).to.emit(
        figurePrintOracle,
        "SetChainLinkToken",
      );
    })
    it("Set ChainLink Oracle", async () => {
      await expect(figurePrintOracle.connect(deployer).setChainLinkOracle(oricle.address)).to.emit(
        figurePrintOracle,
        "SetChainLinkOracle",
      );
    })

    it("Set JobId", async () => {
      await expect(figurePrintOracle.connect(deployer).setJobId(jobId)).to.emit(
        figurePrintOracle,
        "SetJobId",
      );
    })
    it("Set Fee", async () => {
      await expect(figurePrintOracle.connect(deployer).setFee(fee)).to.emit(
        figurePrintOracle,
        "SetFee",
      );
    })

    it("Check Revert on conditions verification", async () => {

      const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
      const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")
      let tx = await figurePrintOracle.createUserSimpleRecord(1, 1);
      await tx.wait(1);

      console.log("User Request Status", await figurePrintOracle.getUserRecord(await deployer.getAddress(),));


      let address = await deployer.getAddress()
      log("address", address)
      // await figurePrintOracle.verifyFingerPrint(address, _userId, _fingurePrint, { gasLimit: 3e7 })
      await expect(figurePrintOracle.verifyFingerPrint(address, _userId, _fingurePrint, { gasLimit: 3e7 })).to.be.revertedWithCustomError(
        figurePrintOracle, "FigurePrintOracle__RequestAlreadyExist"
      ).withArgs(address)
      tx = await figurePrintOracle.createUserSimpleRecord(2, 1);
      await tx.wait(1);
      await expect(figurePrintOracle.verifyFingerPrint(address, _userId, _fingurePrint, { gasLimit: 3e7 })).to.be.revertedWithCustomError(
        figurePrintOracle, "FigurePrintOracle__VerficationAlreadyDone"
      ).withArgs(address)
      tx = await figurePrintOracle.createUserSimpleRecord(3, 4);
      await tx.wait(1);
      await expect(figurePrintOracle.verifyFingerPrint(address, _userId, _fingurePrint, { gasLimit: 3e7 })).to.be.revertedWithCustomError(
        figurePrintOracle, "FigurePrintOracle__ExceedNumberTries"
      ).withArgs(address)

    })
  });

});
