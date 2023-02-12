import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { IAccessControl__factory, IERC165__factory, IERC721__factory, TimeLock, UserIdentityNFT, GovernorContract, OrcaleUrlProvider } from "../typechain-types";
import { getTimeLock, getOrcaleUrlProvider, getUserIdentityNFT, getGovernorContract } from "../instructions"
import {
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
  ORCALE_URL_PROVIDER,
  ORCALE_URL_PROVIDER2
} from "../helper-hardhat-config"
import { moveBlock } from "../utils/move-block"
import { moveTime } from "../utils/move-time"
import { string } from "hardhat/internal/core/params/argumentTypes";
describe("Orcale URL", async function () {
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
      let userAddres = await deployer.getAddress();

      let tx = await governanceToken.connect(deployer).createSimpleNFT();
      await tx.wait(1)

      console.log("balanceOf : ", await governanceToken.connect(deployer).balanceOf(userAddres));

      const encodedFunctionCall = orcaleUrlProvider.interface.encodeFunctionData(FUNC, [ORCALE_URL_PROVIDER2])
      console.log("parameters", governor.address);

      const proposeTx = await governor.propose(
        [orcaleUrlProvider.address],
        [0],
        [encodedFunctionCall],
        PROPOSAL_DESCRIPTION, { gasLimit: 3e7 }
      )

      const proposeReceipt = await proposeTx.wait(1)
      const proposalId = proposeReceipt.events![0].args!.proposalId
      console.log("proposalId :", proposalId);
      let proposalState = await governor.state(proposalId)
      const proposalSnapShot = await governor.proposalSnapshot(proposalId)
      const proposalDeadline = await governor.proposalDeadline(proposalId)
      // The state of the proposal. 1 is not passed. 0 is passed.
      console.log(`Current Proposal State: ${proposalState}`)
      // What block # the proposal was snapshot
      console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
      // The block number the proposal voting expires
      console.log(`Current Proposal Deadline: ${proposalDeadline}`)
      await moveBlock(VOTING_DELAY + 1)
      // vote
      console.log("voting power : ", await governor.getVotes(userAddres, 10));

      const voteTx = await governor.connect(deployer).castVoteWithReason(proposalId, voteWay, reason)
      const voteTxReceipt = await voteTx.wait(1)
      // console.log("voteTxReceipt: ", voteTxReceipt);

      proposalState = await governor.state(proposalId)
      assert.equal(proposalState.toString(), "1")
      console.log(`Current Proposal State: ${proposalState}`)
      await moveBlock(VOTING_PERIOD + 1)
      proposalState = await governor.state(proposalId)
      console.log(`Current Proposal State: ${proposalState}`)
      // console.log("voting power : ", await governor.getVotes(userAddres, 20));

      // queue & execute
      let descriptionHash: string = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
      // descriptionHash = ethers.utils.id(PROPOSAL_DESCRIPTION)
      const queueTx = await governor.queue([orcaleUrlProvider.address], [0], [encodedFunctionCall], descriptionHash, { gasLimit: 3e7 })
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
