// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./../interfaces/IOrcaleUrlProvider.sol";

contract OrcaleUrlProvider is Ownable, IOrcaleUrlProvider {
    string private url;

    constructor(string memory _url) {
        url = _url;
    }

    // Stores a new value in the contract
    function setUrl(string memory _url) public onlyOwner {
        url = _url;
        emit UrlChange(url);
    }

    // Reads the last stored value
    function getURL() public view returns (string memory) {
        return url;
    }
}
