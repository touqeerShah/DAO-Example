// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

struct UserIdVoucher {
    /// @notice The metadata URI to associate with this token.
    string uri;
    /// @notice Minimum price of the nft.
    bytes userId;
    /// @notice True if and only if fixed price mode.
    bytes fingerPrint;
    /// @notice the EIP-712 signature of all other fields in the NFTVoucher struct. For a voucher to be valid, it must be signed by an account with the MINTER_ROLE.
    bytes signature;
}
