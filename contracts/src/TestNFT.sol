// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {ERC721} from "solmate/tokens/ERC721.sol";

contract TestNFT is ERC721("Test NFT", "TEST") {
    uint256 public tokenId = 1;

    function tokenURI(uint256) public pure override returns (string memory) {
        return
            '{"name": "Test NFT", "description": "A Test NFT.", "image": "https://cpmr-islands.org/wp-content/uploads/sites/4/2019/07/test.png"}';
    }

    function mint() public returns (uint256) {
        _mint(msg.sender, tokenId);

        return tokenId++;
    }
}
