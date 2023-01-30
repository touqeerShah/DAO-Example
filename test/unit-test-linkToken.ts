import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { LinkToken } from "../typechain-types";
import { CastVote } from "../utils/castvote"
import { getLinkToken } from "../instructions"

import { moveBlock } from "../utils/move-block"
import { moveTime } from "../utils/move-time"
import { string } from "hardhat/internal/core/params/argumentTypes";
describe("LinkToken", async function () {
  let deployer: Signer;
  let linkToken: LinkToken;


  before(async () => {
    [deployer] = await ethers.getSigners(); // could also do with getNamedAccounts
    linkToken = await getLinkToken();

    console.log("orcaleUrlProvider", linkToken.address)

  });

  describe("orcaleUrlProvider Test", async function () {
    it("Check Link Init Balance", async function () {
      let balance: BigNumber = await linkToken.balanceOf(deployer.getAddress())
      const ethValue = ethers.utils.formatEther(balance);

      // console.log("balance:BigNumber => ", ethValue);
      assert.equal(ethValue, "1000000000.0")

    });


  });

});
