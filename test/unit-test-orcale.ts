import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { LinkToken, FigurePrintOracle } from "../typechain-types";
import { VerifcaitonRecordStruct } from "../typechain-types/contracts/core/FigurePrintOracle";

import { getLinkToken, getFigurePrintOracle } from "../instructions"
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { log } from "console";
import { getStringToBytes } from "../utils/convert"


describe("FigurePrintOracle", async function () {
  let deployer: Signer;
  let deployer2: Signer
  let deployer3: Signer
  let deployer4: Signer

  let linkToken: LinkToken;
  let figurePrintOracle: FigurePrintOracle;


  before(async () => {
    [deployer, deployer2, deployer3, deployer4] = await ethers.getSigners(); // could also do with getNamedAccounts
    linkToken = await getLinkToken();
    figurePrintOracle = await getFigurePrintOracle();
    console.log("orcaleUrlProvider", linkToken.address)

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
    it("Request Already Exist FingurePrint from Orcale", async () => {
      const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("data"))
      console.log(checkData);

      const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
      const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")
      // let tx = await figurePrintOracle.connect(deployer).verifyFingerPrint(await deployer.getAddress(), _userId, _fingurePrint, { gasLimit: 3e7 });
      // (await tx).wait(1)

      console.log(await figurePrintOracle.getUserRecord(await deployer.getAddress(),));
      let address = await deployer.getAddress()
      expect(await figurePrintOracle.verifyFingerPrint(address, _userId, _fingurePrint, { gasLimit: 3e7 })).to.be.revertedWith(
        "FigurePrintOracle__RequestAlreadyExist"
      )

    })
    it("Check URL", async () => {

      let URL = await figurePrintOracle.connect(deployer).getBaseURI();
      console.log("URL", URL);


    })
    it("Verify FingurePrint from Orcale", async () => {
      // console.log(await figurePrintOracle.getUserRecord(await deployer2.getAddress()));
      console.log("start verification");

      await new Promise(async (resolve, reject) => {
        // setup listener before we enter the lottery
        // Just in case the blockchain moves REALLY fast
        figurePrintOracle.once("VerifationResponse", async () => {
          console.log("VerifationResponse event fired!")
          try {
            // add our asserts here
            const userData: VerifcaitonRecordStruct = await figurePrintOracle.getUserRecord("0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65")
            console.log("userData =>", userData)

            assert.equal(userData.status, 2);
            resolve(0);
          } catch (error) {
            console.log(error)
            reject(error)
          }
        })
        // Then entering the verification
        console.log("convert to bytes ");

        const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
        const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")

        console.log("bytes => ", _userId);

        let tx = figurePrintOracle.connect(deployer).verifyFingerPrint('0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', _userId, _fingurePrint);
        (await tx).wait(1)

        console.log(await figurePrintOracle.getUserRecord("0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"));

        // and this code WONT complete until our listener has finished listening!
      })


    })
  });

});
