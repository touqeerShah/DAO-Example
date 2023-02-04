import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { LinkToken, FigurePrintOracle, UserIdentityNFT, PTNFT } from "../typechain-types";
import { UserIdVoucherStruct } from "../typechain-types/contracts/core/UserIdentityNFT";

import { getLinkToken, getFigurePrintOracle, getUserIdentityNFT, getPTNFT } from "../instructions"
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { log } from "console";
import { getStringToBytes } from "../utils/convert"
import { createUserId, createPTNFT } from "../instructions"
import { SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION, IPFS_SIMPLE } from "../helper-hardhat-config"

describe("FigurePrintOracle", async function () {
  let deployer: Signer;
  let deployer2: Signer
  let deployer3: Signer
  let deployer4: Signer
  let deployer5: Signer

  let linkToken: LinkToken;
  let figurePrintOracle: FigurePrintOracle;
  let userIdentityNFT: UserIdentityNFT;
  let ptnft: PTNFT
  let voucher: UserIdVoucherStruct;
  let voucher2: UserIdVoucherStruct;

  before(async () => {
    [deployer, deployer2, deployer3, deployer4, deployer5] = await ethers.getSigners(); // could also do with getNamedAccounts
    linkToken = await getLinkToken();
    figurePrintOracle = await getFigurePrintOracle();
    const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
    const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")
    userIdentityNFT = await getUserIdentityNFT();
    ptnft = await getPTNFT();
    voucher = (await createUserId(
      userIdentityNFT,
      deployer,
      _userId,
      IPFS_SIMPLE,
      _fingurePrint,
      SIGNING_DOMAIN_NAME,
      SIGNING_DOMAIN_VERSION,
    )) as UserIdVoucherStruct;
    voucher2 = (await createPTNFT(
      ptnft,
      deployer,
      _userId,
      IPFS_SIMPLE,
      _fingurePrint,
      SIGNING_DOMAIN_NAME,
      SIGNING_DOMAIN_VERSION,
    )) as UserIdVoucherStruct;
    console.log("voucher2", voucher2);

  });

  describe("figurePrint Oracle Test", async function () {
    it("Check All the Function Restruction Work", async function () {
      let address: string = await deployer.getAddress();
      // await userIdentityNFT.connect(deployer).transferFrom(address, address, 1)
      await expect(userIdentityNFT.connect(deployer).transferFrom(address, address, 2, { gasLimit: 3e7 })).to.revertedWithCustomError(userIdentityNFT, "UserIdentityNFT__TransferNoAllowed").withArgs(2, address)
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
    it("Check verifySignature", async function () {
      const signer = await userIdentityNFT.connect(deployer2).verifySignature(voucher);
      let address = await deployer.getAddress()
      console.log("signer", signer, "address", address);

      assert.equal(signer, (address));
    });
    it("Reed Voucher Without Verification", async function () {

      let tx = await userIdentityNFT.connect(deployer).getfigureprintOracleResponse()
      console.log("tx", tx);
      // console.log(await deployer2.getAddress());

      await expect(userIdentityNFT.connect(deployer2).redeem(voucher)).to.revertedWithCustomError(userIdentityNFT, "UserIdentityNFT__FirstVerifyIdenetity");
      // assert.equal(signer, (address));
    });
    it("Successful Redeem", async function () {
      // let tx = await userIdentityNFT.connect(deployer5).compaire()
      // let respo = await tx.wait(1)
      // console.log(respo);
      // userIdentityNFT.connect(deployer2).redeem(voucher)
      await expect(ptnft.connect(deployer).redeem(deployer2.getAddress(), voucher2)).to.emit(
        ptnft,
        "IdVerifedAndIssued",
      );
    });

  });

});
