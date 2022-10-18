// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {ERC721} from "solmate/tokens/ERC721.sol";

contract NFTShare is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 mintSupply,
        address mintTo
    ) payable ERC20(name, symbol, 18) {
        _mint(mintTo, mintSupply);
    }

    /// @dev The allowance check happens when substracting the amount from the allowed amount. This operation will underflow (and revert) if the caller doesn't have enough allowance.
    function burnFrom(address from, uint256 amount) public payable {
        uint256 allowed = allowance[from][msg.sender]; // Saves gas for limited approvals.

        if (allowed != type(uint256).max)
            allowance[from][msg.sender] = allowed - amount;

        _burn(from, amount);
    }
}

contract Fractron {
    /// @notice Thrown when trying to rejoin a token from a vault that doesn't exist
    // error VaultNotFound();
    /// @notice Thrown when trying to create vault that can't exist
    // error InvalidVault();

    /// @dev Parameters for vaults
    /// @param nftContracts The ERC721 contracts for the fractionalized tokens
    /// @param tokenIds The IDs of the fractionalized tokens
    /// @param tokenSupply The amount of issued ERC20 tokens for this vault
    /// @param tokenContract The ERC20 contract for the issued tokens
    struct Vault {
        ERC721[] nftContracts;
        uint256[] tokenIds;
        uint256 tokenSupply;
        NFTShare tokenContract;
    }

    event VaultCreated(Vault vault);
    event VaultDestroyed(Vault vault);

    uint256 internal currentVaultId = 0;
    mapping(uint256 => Vault) public vaultById;

    function split(
        ERC721[] calldata nftContracts,
        uint256[] calldata tokenIds,
        uint256 supply,
        string memory name,
        string memory symbol
    ) public payable returns (uint256) {
        // if (nftContracts.length != tokenIds.length) revert InvalidVault();
        require(nftContracts.length == tokenIds.length, "invalid vault");
        NFTShare tokenContract = new NFTShare(name, symbol, supply, msg.sender);

        Vault memory vault = Vault({
            nftContracts: nftContracts,
            tokenIds: tokenIds,
            tokenSupply: supply,
            tokenContract: tokenContract
        });

        emit VaultCreated(vault);

        vaultById[currentVaultId] = vault;

        for (uint256 i = 0; i < nftContracts.length; i++) {
            nftContracts[i].transferFrom(
                msg.sender,
                address(this),
                tokenIds[i]
            );
        }

        return currentVaultId++;
    }

    function join(uint256 vaultId) public payable {
        Vault memory vault = vaultById[vaultId];

        // if (address(vault.tokenContract) == address(0)) revert VaultNotFound();
        require(address(vault.tokenContract) != address(0), "vault not found");

        delete vaultById[vaultId];

        vault.tokenContract.burnFrom(msg.sender, vault.tokenSupply);
        for (uint256 i = 0; i < vault.nftContracts.length; i++) {
            vault.nftContracts[i].transferFrom(
                address(this),
                msg.sender,
                vault.tokenIds[i]
            );
        }
    }

    function getVault(uint256 vaultId) public view returns (Vault memory) {
        return vaultById[vaultId];
    }

    function getAllVaults() public view returns (Vault[] memory) {
        Vault[] memory vaults = new Vault[](currentVaultId);
        for (uint256 i = 0; i < currentVaultId; i++) {
            vaults[i] = vaultById[i];
        }
        return vaults;
    }

    /// @dev This function ensures this contract can receive ERC721 tokens
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public payable returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
