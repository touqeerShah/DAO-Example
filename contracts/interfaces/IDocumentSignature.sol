// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/Timers.sol";

interface IDocumentSignature {
    //struct
    struct DocumentDetials {
        address creator;
        bytes name;
        uint256 tokenId;
        bytes description;
        // mapping(uint256 => SignatureStatus) parties;
        Party[] parties;
        DocumentState status;
        uint64 signatureStart;
        uint64 signatureEnd;
    }
    struct Party {
        uint256 tokenId;
        SignatureStatus status;
    }
    enum SignatureStatus {
        Deafult,
        Pending,
        Valid,
        InValid
    }

    enum DocumentState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }

    //Events
    event DocumentedCrearted(
        uint256 indexed documentId,
        uint256 indexed tokenId,
        address indexed creator
    );
    event DocumentProcess(uint256 indexed documentId, bool indexed isValidation);

    // Error
    error DocumentSignature__CreatorIdentityNotExit(address creator);
    error DocumentSignature__StartingAndEndingValuesNotSome(uint64 start, uint64 end);
    error DocumentSignature__InValidSignature(uint256 tokeId);
    error DocumentSignature__OnlyOwnerCanCall();
    error DocumentSignature__UserNotExist();
    error DocumentSignature__NotProcessBecauseNotInQueue();
    error DocumentSignature__InvalidSignatureArrayLength();

    function createDocument(
        bytes memory name,
        bytes memory description,
        string memory uri,
        uint64 signatureStartingPeriod,
        uint64 signatureEndingingPeriod,
        uint256[] memory partiesTokenId
    ) external;

    function processDocument(
        uint256 documentId,
        // uint256[] memory tokenIds,
        bytes[] memory signatures,
        bool isValidation
    ) external;

    function getDocumentDetails(uint256 documentId) external view returns (DocumentDetials memory);

    function checkMyCastedVote(uint256 documentId) external view returns (SignatureStatus);

    function getDocumentStartingTime(uint256 documentId) external view returns (uint256);

    function getDocumentEndingingTime(uint256 documentId) external view returns (uint256);

    function getStatus(uint256 documentId) external view returns (DocumentState);

    function getCurrentTime() external view returns (uint256);
}
