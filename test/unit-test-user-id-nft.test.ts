import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { LinkToken, FigurePrintOracle, UserIdentityNFT, } from "../typechain-types";
import { UserIdVoucherStruct } from "../typechain-types/contracts/core/UserIdentityNFT";


import { getLinkToken, getFigurePrintOracle, getUserIdentityNFT } from "../instructions"
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { log } from "console";
import { getStringToBytes } from "../utils/convert"
import { createUserId } from "../instructions"
import { SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION, IPFS_SIMPLE } from "../helper-hardhat-config"

describe("FigurePrintOracle", async function () {
  let deployer: Signer;
  let deployer2: Signer
  let deployer3: Signer
  let deployer4: Signer
  let deployer5: Signer
  let deployer6: Signer //0x0308b55f7bACa0324Ba6Ff06b22Af1B4e5d71a74

  let linkToken: LinkToken;
  let figurePrintOracle: FigurePrintOracle;
  let userIdentityNFT: UserIdentityNFT;
  let voucher: UserIdVoucherStruct;

  before(async () => {
    [deployer, deployer2, deployer3, deployer4, deployer5, deployer6] = await ethers.getSigners(); // could also do with getNamedAccounts
    linkToken = await getLinkToken();
    figurePrintOracle = await getFigurePrintOracle();
    const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
    const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")
    userIdentityNFT = await getUserIdentityNFT();
    voucher = (await createUserId(
      userIdentityNFT,
      deployer,
      _userId,
      IPFS_SIMPLE,
      _fingurePrint,
      SIGNING_DOMAIN_NAME,
      SIGNING_DOMAIN_VERSION,
    )) as UserIdVoucherStruct;


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
    // it("Check verifySignature", async function () {
    //   const signer = await userIdentityNFT.connect(deployer2).verifySignature(voucher);
    //   let address = await deployer.getAddress()
    //   console.log("signer", signer, "address", address);

    //   assert.equal(signer, (address));
    // });
    it("Check Fingerprint Address", async function () {
      const signer = await userIdentityNFT.connect(deployer2).getFingerPrintAddress();

      console.log("signer", signer);

    });

    it("setFingerPrintAddress", async function () {
      let userAddres = await deployer.getAddress()

      let tx = await userIdentityNFT.setFingerPrintAddress(figurePrintOracle.address)
      await tx.wait(1)
      console.log(tx);

    });

    it("Check Redeem Error handling based on Requests", async function () {

      // let tx = await userIdentityNFT.connect(deployer).getfigureprintOracleAddress()
      // console.log(tx);
      const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
      const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")
      let tx = await figurePrintOracle.createUserSimpleRecord(0, 1);
      await tx.wait(1);
      console.log("User Request Status", await figurePrintOracle.getUserRecord(await deployer.getAddress(),));
      let address = await deployer.getAddress()
      log("address", address)
      // await figurePrintOracle.verifyFingerPrint(address, _userId, _fingurePrint, { gasLimit: 3e7 })
      await expect(userIdentityNFT.redeem(voucher, { gasLimit: 3e7 })).to.be.revertedWithCustomError(
        userIdentityNFT, "UserIdentityNFT__FirstVerifyIdenetity"
      );
      tx = await figurePrintOracle.createUserSimpleRecord(1, 1);
      await tx.wait(1);
      await expect(userIdentityNFT.redeem(voucher, { gasLimit: 3e7 })).to.be.revertedWithCustomError(
        userIdentityNFT, "UserIdentityNFT__VerficationStillPending"
      );
      tx = await figurePrintOracle.createUserSimpleRecord(3, 4);
      await tx.wait(1);
      await expect(userIdentityNFT.redeem(voucher, { gasLimit: 3e7 })).to.be.revertedWithCustomError(
        userIdentityNFT, "UserIdentityNFT__VerficationStillFail"
      );

    });

    it("Reed Voucher Without Verification", async function () {


      let userAddres = await deployer5.getAddress()
      console.log("userAddres", userAddres);

      await expect(userIdentityNFT.connect(deployer).redeem(voucher)).to.be.revertedWith(
        "UserIdentityNFT__FirstVerifyIdenetity"
      )
    });
    it("verifyFingerPrint", async function () {

      const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
      const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")

      await expect(userIdentityNFT.connect(deployer).verifyFingerPrint(_userId, _fingurePrint)).to.emit(
        userIdentityNFT,
        "IdVerifedAndIssued",
      );
    });
    it("Set FingerPrint Address", async function () {
      await expect(userIdentityNFT.connect(deployer).setFingerPrintAddress(figurePrintOracle.address)).to.emit(
        userIdentityNFT,
        "SetFingerPrintAddress",
      );
    });
    it("Successful Redeem", async function () {
      await expect(userIdentityNFT.connect(deployer).redeem(voucher)).to.emit(
        userIdentityNFT,
        "IdVerifedAndIssued",
      );
    });
    it("Verify FingurePrint from Orcale", async () => {
      // console.log(await figurePrintOracle.getUserRecord(await deployer2.getAddress()));
      console.log("start verification");
      let userAddres = await deployer.getAddress()
      await new Promise(async (resolve, reject) => {
        // setup listener before we enter the lottery
        // Just in case the blockchain moves REALLY fast
        figurePrintOracle.connect(deployer).once("VerifationResponse", async () => {
          console.log("VerifationResponse event fired!")
          try {
            // add our asserts here
            const userData = await figurePrintOracle.connect(deployer).getUserRecord(userAddres)
            console.log("userData =>", userData)

            assert.equal(userData, 2);
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

        let tx = userIdentityNFT.connect(deployer).verifyFingerPrint(_userId, _fingurePrint);
        (await tx).wait(1);

        console.log(await figurePrintOracle.connect(deployer).getUserRecord(userAddres));

        // and this code WONT complete until our listener has finished listening!
      })


    })
  });

});
