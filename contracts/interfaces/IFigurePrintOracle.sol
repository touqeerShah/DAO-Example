// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "./../libraries/OracleHelper.sol";

interface IFigurePrintOracle {
    //Events
    event VerifyFingerPrint(bytes indexed userId, bytes32 requestId, address userAddress);
    event VerifationResponse(
        address indexed userAddress,
        bytes32 indexed requestId,
        string isVerfied
    );
    event ReceivedCalled(address indexed buyer, uint256 indexed amount);
    event FallbackCalled(address indexed buyer, uint256 indexed amount);
    event WithDrawAmount(address indexed buyer, uint256 indexed amount);

    // Error
    error FigurePrintOracle__RequestAlreadyExist(address userAddress);
    error FigurePrintOracle__VerficationAlreadyDone(address userAddress);
    error FigurePrintOracle__ExceedNumberTries(address userAddress);
    error FigurePrintOracle__NotVerifer();
    error FigurePrintOracle__NoAmountForWithDraw();
    error FigurePrintOracle__FailToWithDrawAmount();

    function verifyFingerPrint(
        address userAddress,
        bytes calldata userId,
        bytes calldata fingerPrint
    ) external;

    function withdrawLink() external payable;

    function getUserRecord(address userAddress) external returns (VerifcaitonRecord calldata);

    function getUserVerification(address userAddress) external returns (bool);

    function setChainLinkToken(address linkToken) external;

    function setChainLinkOracle(address oricle) external;

    function setJobId(bytes32 _jobId) external;

    function setFee(uint256 _fee) external;

    function setVeriferRole(address verifer) external;

    function burnUserRecord(address userAddress) external;
}
