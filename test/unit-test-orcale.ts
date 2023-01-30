import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { LinkToken, FigurePrintOracle } from "../typechain-types";
import { getLinkToken, getFigurePrintOracle } from "../instructions"


describe("FigurePrintOracle", async function () {
  let deployer: Signer;
  let linkToken: LinkToken;
  let figurePrintOracle: FigurePrintOracle;


  before(async () => {
    [deployer] = await ethers.getSigners(); // could also do with getNamedAccounts
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
  });

});
