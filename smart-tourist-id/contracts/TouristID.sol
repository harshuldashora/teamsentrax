// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin utilities
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TouristID is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from tokenId to tourist info (example)
    mapping(uint256 => string) private _touristInfo;

    constructor() ERC721("TouristID", "TID") {}

    function mintTouristID(address recipient, string memory info) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _touristInfo[newItemId] = info;
        return newItemId;
    }

    function getTouristInfo(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _touristInfo[tokenId];
    }
}
