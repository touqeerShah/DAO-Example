// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "./../interfaces/IFigurePrintOracle.sol";
import "./../interfaces/IUserIdentityNFT.sol";
import "./../libraries/OracleHelper.sol";
import "./../libraries/UserIdentityNFT.sol";

contract UserIdentityNFT is ERC721URIStorage, ReentrancyGuard, ERC721Votes, IUserIdentityNFT {
    using Counters for Counters.Counter;
    Counters.Counter private idCount;
    address private figureprintOracle;
    bytes32 public constant CLAME_USERID_VOUCHER =
        keccak256("createUserId(string uri,bytes userId,bytes fingerPrint)");

    // "NFTVoucher(uint256 tokenId,string uri,address currency,uint256 minPrice,bool isFixedPrice)"

    constructor(
        string memory name,
        string memory symbol,
        string memory signingDomain,
        string memory signatureVersion
    ) ERC721(name, symbol) EIP712(signingDomain, signatureVersion) {
        idCount.increment();
        uint256 tokenId = idCount.current();
        super._mint(msg.sender, tokenId);
    }

    // The functions below are overrides required by Solidity.
    function verifyFingerPrint(bytes memory userId, bytes memory fingerPrint) public {
        checkBalance();
        IFigurePrintOracle(figureprintOracle).verifyFingerPrint(msg.sender, userId, fingerPrint);
        emit IdVerifedAndIssued(userId, msg.sender);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Votes) {
        super._afterTokenTransfer(from, to, firstTokenId, batchSize);
    }

    /// @notice Redeems an NFTVoucher for an actual NFT, creating it in the process.

    function redeem(UserIdVoucher calldata voucher) public {
        VerficationStatus status = IFigurePrintOracle(figureprintOracle).getUserRecord(msg.sender);
        if (status == VerficationStatus.DEAFULT) {
            revert UserIdentityNFT__FirstVerifyIdenetity();
        } else if (status == VerficationStatus.PENDING) {
            revert UserIdentityNFT__VerficationStillPending();
        } else if (status == VerficationStatus.FAIL) {
            revert UserIdentityNFT__VerficationStillFail();
        }
        address signer = verifySignature(voucher);
        if (signer != msg.sender) revert UserIdentityNFT__NotValidUserToRedeem();
        idCount.increment();
        uint256 tokenId = idCount.current();
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, voucher.uri);
        emit IdVerifedAndIssued(voucher.userId, msg.sender);
    }

    /// @notice Redeems an NFTVoucher for an actual NFT, creating it in the process.

    function createSimpleNFT() public {
        idCount.increment();
        uint256 tokenId = idCount.current();
        super._mint(msg.sender, tokenId);
        _setTokenURI(tokenId, "test uri");
    }

    function checkBalance() public view {
        if (balanceOf(msg.sender) > 0) {
            revert UserIdentityNFT__UserIdAlreadyIssued(msg.sender);
        }
    }

    function _hash(UserIdVoucher calldata voucher) internal view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        CLAME_USERID_VOUCHER,
                        keccak256(bytes(voucher.uri)),
                        keccak256(voucher.userId),
                        keccak256(voucher.fingerPrint)
                    )
                )
            );
    }

    /// @notice Verifies the signature for a given NFTVoucher, returning the address of the signer.
    /// @dev Will revert if the signature is invalid. Does not verify that the signer is authorized to mint NFTs.
    /// @param voucher An NFTVoucher describing an unminted NFT.
    function verifySignature(UserIdVoucher calldata voucher) public view returns (address) {
        bytes32 digest = _hash(voucher);
        return ECDSA.recover(digest, voucher.signature);
    }

    function transferFrom(
        address from,
        address /*to*/,
        uint256 tokenId
    ) public virtual override(ERC721) {
        // require(true, "Not Allow to Transfer Token");
        revert UserIdentityNFT__TransferNoAllowed(tokenId, from);
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

    function getFingerPrintAddress() public view returns (address) {
        return address(figureprintOracle);
    }

    function setFingerPrintAddress(address _fingerPrintAddress) public {
        figureprintOracle = _fingerPrintAddress;
        emit SetFingerPrintAddress(figureprintOracle);
    }

    function getIdCount() public view returns (uint256) {
        return idCount.current();
    }
}
