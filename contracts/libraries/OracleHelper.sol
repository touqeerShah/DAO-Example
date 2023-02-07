// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
struct VerifcaitonRecord {
    bytes userId;
    uint numberTries; //no more the 3 request if case of Rejection
    VerficationStatus status; //
}

enum VerficationStatus {
    DEAFULT, // because when check record is pending even it don't exist status will be zero
    PENDING,
    VERIFIED,
    FAIL
}
