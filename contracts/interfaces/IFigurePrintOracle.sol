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
    event SetChainLinkToken(address indexed linkToken);
    event SetChainLinkOracle(address indexed oricle);
    event SetJobId(bytes32 indexed jobId);
    event SetFee(uint256 indexed fee);
    event SetVeriferRole(address indexed verifer);

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

    function getUserRecord(address userAddress) external view returns (VerficationStatus);

    function getUserVerification(address userAddress) external returns (bool);

    function createUserSimpleRecord(VerficationStatus status, uint256 numberTries) external;

    function setChainLinkToken(address linkToken) external;

    function setChainLinkOracle(address oricle) external;

    function setJobId(bytes32 _jobId) external;

    function setFee(uint256 _fee) external;

    function setVeriferRole(address verifer) external;

    function getChainLinkToken() external view returns (address);

    function getChainLinkOracle() external view returns (address);

    function getJobId() external view returns (bytes32);

    function getFee() external view returns (uint256);

    function getVerifier() external view returns (bool);

    function burnUserRecord(address userAddress) external;
}
