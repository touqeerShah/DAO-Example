import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { LinkToken, FigurePrintOracle, UserIdentityNFT, DocumentSignature } from "../typechain-types";
import { UserIdVoucherStruct } from "../typechain-types/contracts/core/UserIdentityNFT";


import { getLinkToken, getFigurePrintOracle, getUserIdentityNFT, getDocumentSignature } from "../instructions"
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
  let documentSignature: DocumentSignature;
  let voucher: UserIdVoucherStruct;
  let voucher2: UserIdVoucherStruct;

  let name: string;
  let documentDescribe: string;
  let signatureStartingPeriod: number;
  let signatureEndingingPeriod: number;
  let partiesTokenId: number[] = [];

  before(async () => {
    [deployer, deployer2, deployer3, deployer4, deployer5, deployer6] = await ethers.getSigners(); // could also do with getNamedAccounts
    linkToken = await getLinkToken();
    figurePrintOracle = await getFigurePrintOracle();
    documentSignature = await getDocumentSignature();
    const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
    const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")
    userIdentityNFT = await getUserIdentityNFT();
    name = "Document Art";
    documentDescribe = "This is document for testing...";
    signatureStartingPeriod = 4;
    signatureEndingingPeriod = 5;
    partiesTokenId = [1, 2, 3];
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
    it("Create Document Without User Id NFT", async function () {
      let address: string = await deployer.getAddress();
      // await userIdentityNFT.connect(deployer).transferFrom(address, address, 1)

      await expect(documentSignature.connect(deployer).createDocument(
        name,
        documentDescribe,
        IPFS_SIMPLE,
        signatureStartingPeriod,
        signatureEndingingPeriod,
        partiesTokenId, { gasLimit: 3e7 }))
        .to.revertedWithCustomError(userIdentityNFT, "DocumentSignature__CreatorIdentityNotExit")
        .withArgs(address)
    });


  });

});



