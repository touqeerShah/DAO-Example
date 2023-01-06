// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IUserIdentityNFT {
    //Events
    event IdVerifedAndIssued(string indexed userId, address userAddres);

    // Error
    error GovernanceNFT__DirectMintNotAllow(uint256 tokenId, address from);
    error GovernanceNFT__TransferNoAllowed(uint256 tokenId, address from);
    error GovernanceNFT__UserIdAlreadyIssued(string userId, address userAddress);
    error GovernanceNFT__VerficationStillPending();
    error GovernanceNFT__VerficationStillRejected();
    error GovernanceNFT__FirstVerifyIdenetity();

    // error FigurePrintOracle__NotVerifer();
    // error FigurePrintOracle__NoAmountForWithDraw();
    // error FigurePrintOracle__FailToWithDrawAmount();
    function verifyFingerPrint(string memory userId, bytes memory fingerPrint) external;

    function getIdCount() external returns (uint256);
}
