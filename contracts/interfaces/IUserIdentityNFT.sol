// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IUserIdentityNFT {
    //Events
    event IdVerifedAndIssued(string indexed userId, address userAddres);
    // event VerifationResponse(string indexed userId, bytes32 indexed requestId, bool isVerfied);
    // event ReceivedCalled(address indexed buyer, uint256 indexed amount);
    // event FallbackCalled(address indexed buyer, uint256 indexed amount);
    // event WithDrawAmount(address indexed buyer, uint256 indexed amount);

    // Error
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
