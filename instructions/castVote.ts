import { VoidSigner } from "@ethersproject/abstract-signer";
import { BigNumber, Signer } from "ethers";
import { DocumentSignature } from "../typechain-types";

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
      { name: "uri", type: "address" },
    ],
  };
  const signature = await (signer as VoidSigner)._signTypedData(domain, types, voucher);
  const _voucher = {
    ...voucher,
    signature,
  };
  return _voucher;
}
