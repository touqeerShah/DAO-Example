// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./../interfaces/IFigurePrintOracle.sol";
import "./OrcaleUrlProvider.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract FigurePrintOracle is
    ChainlinkClient,
    ConfirmedOwner,
    IFigurePrintOracle,
    AccessControl,
    ReentrancyGuard
{
    using Chainlink for Chainlink.Request;
    bytes32 private constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    mapping(bytes32 => address) private userVerficationRequest;
    mapping(uint => string) private apis;

    mapping(address => VerifcaitonRecord) private userVerficationRecord;
    mapping(address => uint256) private amounts;
    OrcaleUrlProvider orcaleUrlProvider;
    bytes32 private jobId;
    uint256 private fee;
    string public baseUrl;

    // Modifiers
    modifier onlyVerifier() {
        if (!hasRole(VERIFIER_ROLE, msg.sender)) revert FigurePrintOracle__NotVerifer();
        _;
    }

    /**
     * @notice Initialize the link token and target oracle
     *
     * Goerli Testnet details:
     * Link Token: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Oracle: 0xCC79157eb46F5624204f47AB42b3906cAA40eaB7 (Chainlink DevRel)
     * jobId: 0x3764383061363338366566353433613361626235323831376636373037653362
     *   _Fee 100000000000000000
     * _oP 0x04B0601D72dAEEA5D88D5d3B3495854FEe6cCf36
     *
     *
     *
     */
    constructor(
        address _linkToken,
        address _oricle,
        bytes32 _jobId,
        uint256 _fee,
        address _orcaleUrlProvider
    ) ConfirmedOwner(msg.sender) {
        setChainlinkToken(_linkToken);
        setChainlinkOracle(_oricle);
        jobId = _jobId;
        fee = _fee; //(1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
        orcaleUrlProvider = OrcaleUrlProvider(_orcaleUrlProvider);

        apis[0] = "getUri";
        apis[1] = "getVerfity";
    }

    //// receive
    receive() external payable {
        amounts[msg.sender] += msg.value;
        emit ReceivedCalled(msg.sender, msg.value);
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function verifyFingerPrint(
        address userAddress,
        bytes calldata userId,
        bytes calldata fingerPrint
    ) public nonReentrant {
        //if record exist and pending
        uint numberTries = 0;
        if (userVerficationRecord[userAddress].status == VerficationStatus.PENDING) {
            revert FigurePrintOracle__RequestAlreadyExist(userAddress);
        } else if (userVerficationRecord[userAddress].status == VerficationStatus.VERIFIED) {
            revert FigurePrintOracle__VerficationAlreadyDone(userAddress);
        } else if (
            userVerficationRecord[userAddress].status == VerficationStatus.FAIL &&
            userVerficationRecord[userAddress].numberTries > 3
        ) {
            revert FigurePrintOracle__ExceedNumberTries(userAddress);
        } else if (userVerficationRecord[userAddress].status == VerficationStatus.FAIL) {
            numberTries = userVerficationRecord[userAddress].numberTries++;
        }
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillMultipleParameters.selector
        );
        // Set the URL to perform the GET request on
        baseUrl = orcaleUrlProvider.getURL();

        req.add(
            "get",
            string(
                abi.encodePacked(baseUrl, apis[1], "?userId=", userId, "&fingerPrint=", fingerPrint)
            )
        );
        req.add("path", "verficationResponse"); //resposnse from api

        // // // Sends the request
        bytes32 requestId = sendChainlinkRequest(req, fee);
        userVerficationRequest[requestId] = userAddress;
        userVerficationRecord[userAddress] = VerifcaitonRecord(
            userId,
            numberTries,
            VerficationStatus.PENDING
        );
        emit VerifyFingerPrint(userId, requestId, userAddress);
    }

    /**
     * @notice Fulfillment function for multiple parameters in a single request
     * @dev This is called by the oracle. recordChainlinkFulfillment must be used.
     */
    function fulfillMultipleParameters(
        bytes32 _requestId,
        string memory isVerfied
    )
        public
        // string memory uri
        recordChainlinkFulfillment(_requestId)
    {
        VerficationStatus _status;
        if (keccak256(bytes(isVerfied)) == keccak256(bytes("true"))) {
            _status = VerficationStatus.VERIFIED;
        } else {
            _status = VerficationStatus.FAIL;
        }
        userVerficationRecord[userVerficationRequest[_requestId]].status = _status;
        emit VerifationResponse(userVerficationRequest[_requestId], _requestId, isVerfied);
    }

    /// @notice this allow Buyer whose offer is expire or over by other buyer .
    function withdrawLink() public payable nonReentrant {
        uint256 amount = amounts[msg.sender];
        if (amount == 0) revert FigurePrintOracle__NoAmountForWithDraw();
        amounts[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) {
            revert FigurePrintOracle__FailToWithDrawAmount();
        }
        emit WithDrawAmount(msg.sender, amount);
    }

    function getUserRecord(address userAddress) public view returns (VerifcaitonRecord memory) {
        return userVerficationRecord[userAddress];
    }

    function updateBaseURI() public {
        baseUrl = orcaleUrlProvider.getURL();
    }

    function getBaseURI() public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    orcaleUrlProvider.getURL(),
                    apis[1],
                    "?userId=",
                    "test",
                    "&fingerPrint=",
                    "fingerPrint"
                )
            );
        // return orcaleUrlProvider.getURL();
    }

    function setChainLinkToken(address linkToken) public onlyOwner nonReentrant {
        super.setChainlinkToken(linkToken);
    }

    function setChainLinkOracle(address oricle) public onlyOwner nonReentrant {
        super.setChainlinkOracle(oricle);
    }

    function setJobId(bytes32 _jobId) public onlyOwner nonReentrant {
        jobId = _jobId;
    }

    function setFee(uint256 _fee) public onlyOwner nonReentrant {
        fee = _fee;
    }

    function setVeriferRole(address verifer) public onlyOwner nonReentrant {
        _setupRole(VERIFIER_ROLE, verifer);
    }

    function burnUserRecord(address userAddress) public onlyVerifier nonReentrant {
        userVerficationRecord[userAddress].status = VerficationStatus.DEAFULT;
    }
}
