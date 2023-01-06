// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IOrcaleUrlProvider {
    //Events
    event UrlChange(string indexed url);

    // function
    function setUrl(string memory url) external;

    function getURL() external returns (string memory);
}
