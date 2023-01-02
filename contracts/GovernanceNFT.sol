// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

contract GovernanceNFT is ERC721Votes {
    uint256 public tokenCount;

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

    function _mint(address to, uint256 tokenId) internal override(ERC721) {
        super._mint(to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }
}
