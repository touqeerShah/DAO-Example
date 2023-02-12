import { VoidSigner } from "@ethersproject/abstract-signer";
import { BigNumber, Signer } from "ethers";
import { DocumentSignature, UserIdentityNFT } from "../typechain-types";

export async function castVote(
  documentSignature: DocumentSignature,
  signer: Signer,
  tokenId: number,
  documentId: BigNumber,
  signingDomain: string,
  signatureVersion: string,
) {
  const voucher = { tokenId, documentId };
  const chainId = (await documentSignature.provider.getNetwork()).chainId;
  const domain = {
    name: signingDomain,
    version: signatureVersion,
    verifyingContract: documentSignature.address,
    chainId,
  };
  const types = {
    createDocument: [
      { name: "tokenId", type: "uint256" },
      { name: "documentId", type: "uint256" },
    ],
  };
  const signature = await (signer as VoidSigner)._signTypedData(domain, types, voucher);
  const _voucher = {
    ...voucher,
    signature,
  };
  return signature;
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


