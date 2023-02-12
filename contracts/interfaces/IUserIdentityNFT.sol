// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "./../libraries/OracleHelper.sol";
import "./../libraries/UserIdentityNFT.sol";

interface IUserIdentityNFT {
    //Events
    event IdVerifedAndIssued(bytes indexed userId, address userAddres);
    event SetFingerPrintAddress(address figureprintOracle);

    // Error
    error UserIdentityNFT__DirectMintNotAllow(uint256 tokenId, address from);
    error UserIdentityNFT__TransferNoAllowed(uint256 tokenId, address from);
    error UserIdentityNFT__UserIdAlreadyIssued(address userAddress);
    error UserIdentityNFT__NotValidUserToRedeem();
    error UserIdentityNFT__VerficationStillPending();
    error UserIdentityNFT__VerficationStillFail();
    error UserIdentityNFT__FirstVerifyIdenetity();

    // error FigurePrintOracle__NotVerifer();
    // error FigurePrintOracle__NoAmountForWithDraw();
    // error FigurePrintOracle__FailToWithDrawAmount();
    function verifyFingerPrint(bytes memory userId, bytes memory fingerPrint) external;

    function redeem(UserIdVoucher calldata voucher) external;

    function createSimpleNFT() external;

    function getIdCount() external view returns (uint256);

    function checkBalance() external view;

    function getFingerPrintAddress() external view returns (address);

    function setFingerPrintAddress(address _fingerPrintAddress) external;
}
