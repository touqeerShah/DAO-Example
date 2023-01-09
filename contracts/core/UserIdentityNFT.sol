// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "./FigurePrintOracle.sol";
import "./../interfaces/IUserIdentityNFT.sol";
import "./../libraries/helper.sol";

contract UserIdentityNFT is ERC721URIStorage, ERC721Votes, IUserIdentityNFT {
    using Counters for Counters.Counter;
    Counters.Counter private idCount;
    FigurePrintOracle private figureprintOracle;

    constructor(
        address payable _figureprintOracle,
        string memory name,
        string memory symbol,
        string memory signingDomain,
        string memory signatureVersion
    ) ERC721(name, symbol) EIP712(signingDomain, signatureVersion) {
        figureprintOracle = FigurePrintOracle(_figureprintOracle);
        // idCount.increment();
        // _mint(msg.sender, idCount.current());
    }

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Votes) {
        super._afterTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function verifyFingerPrint(string memory userId, bytes memory fingerPrint) public {
        if (balanceOf(msg.sender) > 0) {
            revert GovernanceNFT__UserIdAlreadyIssued(userId, msg.sender);
        }
        figureprintOracle.verifyFingerPrint(msg.sender, userId, fingerPrint);
        //check user balance if it is one not allow to verify new ID
        // first we call here connect with oricel contract to send request for vaification of the data
    }

    /// @notice Redeems an NFTVoucher for an actual NFT, creating it in the process.

    function redeem() external {
        // super._mint(to, tokenId);
        // get user id and get which token id assign to that user and what is the status of signature
        VerifcaitonRecord memory userRecord = figureprintOracle.getUserRecord(msg.sender);
        idCount.increment();
        uint256 tokenId = idCount.current();
        if (userRecord.status == VerficationStatus.DEAFULT) {
            revert GovernanceNFT__FirstVerifyIdenetity();
        } else if (userRecord.status == VerficationStatus.VERIFIED) {
            super._mint(msg.sender, tokenId);
            super._setTokenURI(tokenId, userRecord.uri);
            emit IdVerifedAndIssued(userRecord.userId, msg.sender);
        } else if (userRecord.status == VerficationStatus.PENDING) {
            revert GovernanceNFT__VerficationStillPending();
        } else if (userRecord.status == VerficationStatus.PENDING) {
            revert GovernanceNFT__VerficationStillRejected();
        }
    }

    /**
     * First we request to Oracles to verfiy our Identity with Id Number and finger print hash
     */
    function _mint(address to, uint256 tokenId) internal pure override(ERC721) {
        revert GovernanceNFT__DirectMintNotAllow(tokenId, to);
    }

    function _safeMint(address to, uint256 tokenId) internal virtual override {
        revert GovernanceNFT__DirectMintNotAllow(tokenId, to);
    }

    function _safeMint(
        address to,
        uint256 tokenId,
        bytes memory /* data*/
    ) internal virtual override {
        revert GovernanceNFT__DirectMintNotAllow(tokenId, to);
    }

    function transferFrom(
        address from,
        address /*to*/,
        uint256 tokenId
    ) public virtual override(ERC721) {
        revert GovernanceNFT__TransferNoAllowed(tokenId, from);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address /*to*/,
        uint256 tokenId
    ) public virtual override {
        revert GovernanceNFT__TransferNoAllowed(tokenId, from);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address /*to*/,
        uint256 tokenId,
        bytes memory /*data*/
    ) public virtual override {
        revert GovernanceNFT__TransferNoAllowed(tokenId, from);
    }

    function _safeTransfer(
        address from,
        address /*to*/,
        uint256 tokenId,
        bytes memory /*data*/
    ) internal virtual override {
        revert GovernanceNFT__TransferNoAllowed(tokenId, from);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        // burnUserRecord call but first check the user is owner of the NFT
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function getIdCount() public view returns (uint256) {
        return idCount.current();
    }
}
