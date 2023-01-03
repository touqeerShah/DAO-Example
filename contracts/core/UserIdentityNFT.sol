// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

contract UserIdentityNFT is ERC721Votes {
    uint256 public tokenCount;
    error GovernanceNFT__TransferNoAllowed(uint256 tokenId, address from);

    constructor() ERC721("GovernanceToken", "GT") EIP712("GovernanceToken", "GT") {
        tokenCount = 1;
        _mint(msg.sender, tokenCount);
    }

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721Votes) {
        super._afterTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function verifyIdentity(string memory id, bytes32 fingerPrint) public {
        // first we call here connect with oricel contract to send request for vaification of the data
    }

    /**
     * First we request to Oracles to verfiy our Identity with Id Number and finger print hash
     */
    function _mint(address to, uint256 tokenId) internal override(ERC721) {
        // super._mint(to, tokenId);
        // get user id and get which token id assign to that user and what is the status of signature
    }

    function _safeMint(address to, uint256 tokenId) internal virtual override {
        // super._safeMint(to, tokenId, "");
    }

    function _safeMint(address to, uint256 tokenId, bytes memory data) internal virtual override {
        // super._safeMint(to, tokenId, "");
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

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }
}
