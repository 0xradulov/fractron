// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {Vm} from "forge-std/Vm.sol";
import {DSTest} from "ds-test/test.sol";
import {stdError} from "forge-std/test.sol";
import {ERC721} from "solmate/tokens/ERC721.sol";
import {Fractron, NFTShare} from "../Fractron.sol";

contract User {}

contract TestNFT is ERC721("Test NFT", "TEST") {
    uint256 public tokenId = 1;

    function tokenURI(uint256) public pure override returns (string memory) {
        return "test";
    }

    function mint() public returns (uint256) {
        _mint(msg.sender, tokenId);

        return tokenId++;
    }
}

contract FractronTest is DSTest {
    uint256 collection1_id1;
    uint256 collection1_id2;
    uint256 collection2_id1;
    uint256 collection2_id2;
    User internal user;
    TestNFT internal collection1;
    TestNFT internal collection2;
    Vm internal hevm = Vm(HEVM_ADDRESS);
    Fractron internal fractron;

    ERC721[] internal nftContracts;
    ERC721[] internal nftContracts2;
    uint256[] internal nftIds;
    uint256[] internal nftIds2;

    event VaultCreated(Fractron.Vault vault);
    event VaultDestroyed(Fractron.Vault vault);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    function setUp() public {
        user = new User();
        collection1 = new TestNFT();
        collection2 = new TestNFT();
        fractron = new Fractron();

        collection1.setApprovalForAll(address(fractron), true);
        collection2.setApprovalForAll(address(fractron), true);

        hevm.prank(address(user));
        collection1.setApprovalForAll(address(fractron), true);
        hevm.prank(address(user));
        collection2.setApprovalForAll(address(fractron), true);

        collection1_id1 = collection1.mint();
        collection1_id2 = collection1.mint();
        collection2_id1 = collection2.mint();
        collection2_id2 = collection2.mint();

        nftContracts.push(collection1);
        nftContracts.push(collection1);
        nftContracts.push(collection2);

        nftIds.push(collection1_id1);
        nftIds.push(collection1_id2);
        nftIds.push(collection2_id1);

        nftContracts2.push(collection2);
        nftIds2.push(collection2_id2);
    }

    function testCanSplitToken() public {
        assertEq(collection1.ownerOf(collection1_id1), address(this));

        hevm.expectEmit(true, true, false, true);
        emit Transfer(address(0), address(this), 100 ether);

        uint256 vaultId = fractron.split(
            nftContracts,
            nftIds,
            100 ether,
            "Fractionalised NFT",
            "FRAC"
        );

        Fractron.Vault memory vault = fractron.getVault(vaultId);

        for (uint256 i = 0; i < vault.nftContracts.length; i++) {
            assertEq(
                vault.nftContracts[i].ownerOf(nftIds[i]),
                address(fractron)
            );
            assertEq(address(vault.nftContracts[i]), address(nftContracts[i]));
            assertEq(vault.tokenIds[i], nftIds[i]);
        }

        assertEq(vault.tokenSupply, 100 ether);
        assertEq(vault.tokenContract.balanceOf(address(this)), 100 ether);
    }

    function testTotalSupplyOwnerCanJoinToken() public {
        uint256 vaultId = fractron.split(
            nftContracts,
            nftIds,
            100 ether,
            "Fractionalised NFT",
            "FRAC"
        );

        Fractron.Vault memory vault = fractron.getVault(vaultId);
        for (uint256 i = 0; i < vault.nftContracts.length; i++) {
            assertEq(
                vault.nftContracts[i].ownerOf(vault.tokenIds[i]),
                address(fractron)
            );
        }
        assertEq(vault.tokenContract.balanceOf(address(this)), 100 ether);

        vault.tokenContract.approve(address(fractron), type(uint256).max);
        fractron.join(vaultId);

        for (uint256 i = 0; i < vault.nftContracts.length; i++) {
            assertEq(
                vault.nftContracts[i].ownerOf(vault.tokenIds[i]),
                address(this)
            );
        }
        assertEq(vault.tokenContract.balanceOf(address(this)), 0);

        vault = fractron.getVault(vaultId);
        for (uint256 i = 0; i < vault.nftContracts.length; i++) {
            assertEq(vault.tokenIds[0], 0);
        }
    }

    function testCanGetAllVaults() public {
        fractron.split(
            nftContracts,
            nftIds,
            100 ether,
            "Fractionalised NFT",
            "FRAC"
        );
        fractron.split(
            nftContracts2,
            nftIds2,
            100 ether,
            "Fractionalised NFT",
            "FRAC"
        );

        Fractron.Vault[] memory vaults = fractron.getAllVaults();
        for (uint256 i = 0; i < vaults.length; i++) {
            assertTrue(address(vaults[i].tokenContract) != address(0));
        }
    }
}
