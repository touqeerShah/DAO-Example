import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { IAccessControl__factory, IERC165__factory, IERC721__factory, DocumentSignature } from "../typechain-types";
import { getDocumentSignature, castVote, getInterfaceID } from "../instructions";
import { CastVote } from "../utils/castvote"
const PRINT_LOG = false;

describe("PTCollection", async function () {
  let admin: Signer, virtualMarket: Signer, userA: Signer, userB: Signer;
  let ptCollection: DocumentSignature;
  let voucher: CastVote;

  const COLLECTION_SIGNING_DOMAIN = "PT-Voucher";
  const COLLECTION_SIGNATURE_VERSION = "1";
  const NFT_URI = "ipfs://QmQFcbsk1Vjt1n361MceM5iNeMTuFzuVUZ1hKFWD7ZCpuC";
  const MIN_PRICE = ethers.utils.parseEther("10");

  before(async () => {

  });

  describe("PTCollection.redeem", async function () {
    it("Unallowed user", async function () {

    });

  });

});
