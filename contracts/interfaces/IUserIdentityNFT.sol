// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "./../libraries/OracleHelper.sol";

interface IUserIdentityNFT {
    //Events
    event IdVerifedAndIssued(bytes indexed userId, address userAddres, VerficationStatus status);

    // Error
    error UserIdentityNFT__DirectMintNotAllow(uint256 tokenId, address from);
    error UserIdentityNFT__TransferNoAllowed(uint256 tokenId, address from);
    error UserIdentityNFT__UserIdAlreadyIssued(bytes userId, address userAddress);
    error UserIdentityNFT__NotValidUserToRedeem();
    error UserIdentityNFT__VerficationStillPending();
    error UserIdentityNFT__VerficationStillFail();
    error UserIdentityNFT__FirstVerifyIdenetity();

    // error FigurePrintOracle__NotVerifer();
    // error FigurePrintOracle__NoAmountForWithDraw();
    // error FigurePrintOracle__FailToWithDrawAmount();
    function verifyFingerPrint(bytes memory userId, bytes memory fingerPrint) external;

    function getIdCount() external returns (uint256);
}
