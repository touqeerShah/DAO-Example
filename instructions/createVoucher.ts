import { VoidSigner } from "@ethersproject/abstract-signer";
import { BigNumber, Signer } from "ethers";
import { DocumentSignature, UserIdentityNFT, PTNFT } from "../typechain-types";

export async function castVote(
  ptCollection: DocumentSignature,
  signer: Signer,
  tokenId: BigNumber,
  uri: string,
  documentId: BigNumber,
  signingDomain: string,
  signatureVersion: string,
) {
  const voucher = { tokenId, documentId, uri };
  const chainId = (await ptCollection.provider.getNetwork()).chainId;
  const domain = {
    name: signingDomain,
    version: signatureVersion,
    verifyingContract: ptCollection.address,
    chainId,
  };
  const types = {
    createDocument: [
      { name: "tokenId", type: "uint256" },
      { name: "documentId", type: "uint256" },
      { name: "uri", type: "string" },
    ],
  };
  const signature = await (signer as VoidSigner)._signTypedData(domain, types, voucher);
  const _voucher = {
    ...voucher,
    signature,
  };
  return _voucher;
}

export async function createUserId(
  userIdentityNFT: UserIdentityNFT,
  signer: Signer,
  userId: string,
  uri: string,
  fingerPrint: string,
  signingDomain: string,
  signatureVersion: string,
) {
  const voucher = { uri, userId, fingerPrint };
  const chainId = (await userIdentityNFT.provider.getNetwork()).chainId;
  const domain = {
    name: signingDomain,
    version: signatureVersion,
    verifyingContract: userIdentityNFT.address,
    chainId,
  };
  const types = {
    createUserId: [
      { name: "uri", type: "string" },
      { name: "userId", type: "bytes" },
      { name: "fingerPrint", type: "bytes" },
    ],
  };
  // console.log("types", types);

  const signature = await (signer as VoidSigner)._signTypedData(domain, types, voucher);
  const _voucher = {
    ...voucher,
    signature,
  };
  return _voucher;
}


export async function createPTNFT(
  userIdentityNFT: PTNFT,
  signer: Signer,
  userId: string,
  uri: string,
  fingerPrint: string,
  signingDomain: string,
  signatureVersion: string,
) {
  const voucher = { uri, userId, fingerPrint };
  const chainId = (await userIdentityNFT.provider.getNetwork()).chainId;
  const domain = {
    name: signingDomain,
    version: signatureVersion,
    verifyingContract: userIdentityNFT.address,
    chainId,
  };
  const types = {
    createUserId: [
      { name: "uri", type: "string" },
      { name: "userId", type: "bytes" },
      { name: "fingerPrint", type: "bytes" },
    ],
  };
  // console.log("types", types);

  const signature = await (signer as VoidSigner)._signTypedData(domain, types, voucher);
  const _voucher = {
    ...voucher,
    signature,
  };
  return _voucher;
}