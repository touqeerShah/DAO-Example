import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { LinkToken, FigurePrintOracle, UserIdentityNFT, DocumentSignature } from "../typechain-types";
import { IDocumentSignature } from "../typechain-types/contracts/core/DocumentSignature";


import { getLinkToken, getFigurePrintOracle, getUserIdentityNFT, getDocumentSignature } from "../instructions"
import { moveBlock } from "../utils/move-block"
import { moveTime } from "../utils/move-time"
import { getStringToBytes } from "../utils/convert"
import { castVote } from "../instructions"
import { DS_SIGNING_DOMAIN_NAME, DS_SIGNING_DOMAIN_VERSION, IPFS_SIMPLE } from "../helper-hardhat-config"

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
  let voucher: string;
  let voucher2: string;
  let voucher3: string;

  let name: string;
  let documentDescribe: string;
  let signatureStartingPeriod: number;
  let signatureEndingingPeriod: number;
  let partiesTokenId: number[] = [];
  let documentId: BigNumber;
  before(async () => {
    [deployer, deployer2, deployer3, deployer4, deployer5, deployer6] = await ethers.getSigners(); // could also do with getNamedAccounts
    linkToken = await getLinkToken();
    figurePrintOracle = await getFigurePrintOracle();
    documentSignature = await getDocumentSignature();
    userIdentityNFT = await getUserIdentityNFT();

    const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
    const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")
    name = getStringToBytes("Document Art");
    documentDescribe = getStringToBytes("This is document for testing...");
    signatureStartingPeriod = 4;
    signatureEndingingPeriod = 5;
    partiesTokenId = [1];
    documentId = await documentSignature.getDocumentId(1, name,
      documentDescribe,
      partiesTokenId)
    voucher = (await castVote(
      documentSignature,
      deployer,
      1,
      documentId,
      DS_SIGNING_DOMAIN_NAME,
      DS_SIGNING_DOMAIN_VERSION
    ));
    voucher2 = (await castVote(
      documentSignature,
      deployer2,
      1,
      documentId,
      DS_SIGNING_DOMAIN_NAME,
      DS_SIGNING_DOMAIN_VERSION
    ));
    voucher3 = (await castVote(
      documentSignature,
      deployer3,
      1,
      documentId,
      DS_SIGNING_DOMAIN_NAME,
      DS_SIGNING_DOMAIN_VERSION
    ));

  });

  describe("figurePrint Oracle Test", async function () {
    it("DocumentSignature Create Document Without User Id NFT", async function () {
      let address: string = await deployer.getAddress();
      // await userIdentityNFT.connect(deployer).transferFrom(address, address, 1)

      await expect(documentSignature.connect(deployer).createDocument(
        name,
        documentDescribe,
        IPFS_SIMPLE,
        signatureStartingPeriod,
        signatureEndingingPeriod,
        partiesTokenId, { gasLimit: 3e7 }))
        .to.revertedWithCustomError(documentSignature, "DocumentSignature__CreatorIdentityNotExit")
        .withArgs(address)
    });
    it("DocumentSignature Create Time of starting Signature and ending Signature will not some", async function () {
      let tx = await userIdentityNFT.connect(deployer).createSimpleNFT();
      await tx.wait(1)
      signatureStartingPeriod = 4;
      signatureEndingingPeriod = 4;

      await expect(documentSignature.connect(deployer).createDocument(
        name,
        documentDescribe,
        IPFS_SIMPLE,
        signatureStartingPeriod,
        signatureEndingingPeriod,
        partiesTokenId, { gasLimit: 3e7 }))
        .to.revertedWithCustomError(documentSignature, "DocumentSignature__StartingAndEndingValuesNotSome")
        .withArgs(signatureStartingPeriod, signatureEndingingPeriod)
    });
    it("DocumentSignature Check Vote Status without Document", async function () {

      let documentId = await documentSignature.getDocumentId(1, name,
        documentDescribe,
        partiesTokenId)
      console.log(documentId);

      await expect(documentSignature.connect(deployer).checkMyCastedVote(
        documentId, { gasLimit: 3e7 }))
        .to.revertedWithCustomError(documentSignature, "DocumentSignature__UserNotExist")
    });
    it("DocumentSignature succefully Document Creation ", async function () {
      // let tx = await userIdentityNFT.connect(deployer).createSimpleNFT();
      // await tx.wait(1)
      signatureStartingPeriod = 4;
      signatureEndingingPeriod = 5;
      await expect(documentSignature.connect(deployer).createDocument(
        name,
        documentDescribe,
        IPFS_SIMPLE,
        signatureStartingPeriod,
        signatureEndingingPeriod,
        partiesTokenId, { gasLimit: 3e7 }))
        .to.emit(documentSignature, "DocumentedCrearted")
    });

    it("DocumentSignature Get Vote Status", async function () {
      let status = await documentSignature.connect(deployer).checkMyCastedVote(
        documentId, { gasLimit: 3e7 })
      assert.equal(1, status)

    });
    it("DocumentSignature Get Document Details", async function () {
      let document = await documentSignature.connect(deployer).getDocumentDetails(
        documentId, { gasLimit: 3e7 })
      console.log(document);
    });

    it("DocumentSignature Document Status Active", async function () {
      await moveBlock(5);
      console.log(await documentSignature.connect(deployer).getCurrentTime());


      let document: IDocumentSignature.DocumentDetialsStruct = await documentSignature.connect(deployer).getDocumentDetails(
        documentId, { gasLimit: 3e7 })

      assert.equal(document.status, 1)

    });

    it("DocumentSignature Try To Process Active Document With TimeOver", async function () {

      let documentId = await documentSignature.getDocumentId(1, name,
        documentDescribe,
        partiesTokenId)

      await expect(documentSignature.connect(deployer).processDocument(
        documentId, [voucher], true, { gasLimit: 3e7 }))
        .to.revertedWithCustomError(documentSignature, "DocumentSignature__NotProcessBecauseNotInQueue")
    });
    it("DocumentSignature Document Status Queued", async function () {

      await moveBlock(5);
      let document: IDocumentSignature.DocumentDetialsStruct = await documentSignature.connect(deployer).getDocumentDetails(
        documentId, { gasLimit: 3e7 })
      // console.log(document.status);

      assert.equal(document.status, 5)

    });
    it("DocumentSignature Verify Signature ", async function () {

      let signer = await documentSignature.connect(deployer).verifification(1,
        documentId, voucher, { gasLimit: 3e7 })
      console.log(signer, await deployer.getAddress());

      assert.equal(signer, await deployer.getAddress())

    });
    it("DocumentSignature Try To Process Active Document with Invalid Signature Array", async function () {


      await expect(documentSignature.connect(deployer).processDocument(
        documentId, [voucher, voucher2, voucher3], true, { gasLimit: 3e7 }))
        .to.revertedWithCustomError(documentSignature, "DocumentSignature__InvalidSignatureArrayLength")
    });
    it("DocumentSignature Try To Process Active Document with Invalid Signature", async function () {


      await expect(documentSignature.connect(deployer).processDocument(
        documentId, [voucher2], true, { gasLimit: 3e7 }))
        .to.revertedWithCustomError(documentSignature, "DocumentSignature__InValidSignature").withArgs(1)
    });

    it("DocumentSignature Process Active Document and Status move to Succeeded", async function () {

      let documentId = await documentSignature.getDocumentId(1, name,
        documentDescribe,
        partiesTokenId)

      await expect(documentSignature.connect(deployer).processDocument(
        documentId, [voucher], false, { gasLimit: 3e7 }))
        .to.emit(documentSignature, "DocumentProcess")

      let document: IDocumentSignature.DocumentDetialsStruct = await documentSignature.connect(deployer).getDocumentDetails(
        documentId, { gasLimit: 3e7 })
      // console.log(document.status);

      assert.equal(document.status, 4)
    });


  });

});



