import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { IAccessControl__factory, IERC165__factory, IERC721__factory, TimeLock, UserIdentityNFT, GovernorContract, OrcaleUrlProvider } from "../typechain-types";
import { getDocumentSignature, castVote, getInterfaceID } from "../instructions";
import { CastVote } from "../utils/castvote"
import { getTimeLock, getOrcaleUrlProvider, getUserIdentityNFT, getGovernorContract } from "../instructions"
import {
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
  ORCALE_URL_PROVIDER
} from "../helper-hardhat-config"
import { moveBlock } from "../utils/move-block"
import { moveTime } from "../utils/move-time"
import { string } from "hardhat/internal/core/params/argumentTypes";
describe("PTCollection", async function () {
  let deployer: Signer;
  let orcaleUrlProvider: OrcaleUrlProvider;
  let governor: GovernorContract
  let governanceToken: UserIdentityNFT
  let timeLock: TimeLock
  const voteWay = 1 // for
  const reason = "I lika do da cha cha"

  before(async () => {
    [deployer] = await ethers.getSigners(); // could also do with getNamedAccounts
    orcaleUrlProvider = await getOrcaleUrlProvider();
    governor = await getGovernorContract()
    timeLock = await getTimeLock()
    governanceToken = await getUserIdentityNFT()
    console.log("orcaleUrlProvider", orcaleUrlProvider.address)

  });

  describe("orcaleUrlProvider Test", async function () {
    it("Check Basic Orcale Url Provider", async function () {
      let url = await orcaleUrlProvider.getURL()
      console.log("url => ", url);
      assert.equal(url, ORCALE_URL_PROVIDER)

    });
    it("proposes, votes, waits, queues, and then executes", async () => {
      // propose
      const encodedFunctionCall = orcaleUrlProvider.interface.encodeFunctionData(FUNC, [NEW_STORE_VALUE])
      const proposeTx = await governor.propose(
        [orcaleUrlProvider.address],
        [0],
        [encodedFunctionCall],
        PROPOSAL_DESCRIPTION
      )

      const proposeReceipt = await proposeTx.wait(1)
      const proposalId = proposeReceipt.events![0].args!.proposalId
      let proposalState = await governor.state(proposalId)
      console.log(`Current Proposal State: ${proposalState}`)

      await moveBlock(VOTING_DELAY + 1)
      // vote
      const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason)
      await voteTx.wait(1)
      proposalState = await governor.state(proposalId)
      assert.equal(proposalState.toString(), "1")
      console.log(`Current Proposal State: ${proposalState}`)
      await moveBlock(VOTING_PERIOD + 1)

      // queue & execute
      // const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
      const descriptionHash = ethers.utils.id(PROPOSAL_DESCRIPTION)
      const queueTx = await governor.queue([orcaleUrlProvider.address], [0], [encodedFunctionCall], descriptionHash)
      await queueTx.wait(1)
      await moveTime(MIN_DELAY + 1)
      await moveBlock(1)

      proposalState = await governor.state(proposalId)
      console.log(`Current Proposal State: ${proposalState}`)

      console.log("Executing...")
      console.log
      const exTx = await governor.execute([orcaleUrlProvider.address], [0], [encodedFunctionCall], descriptionHash)
      await exTx.wait(1)
      console.log((await orcaleUrlProvider.getURL()).toString())
    })

  });

});
