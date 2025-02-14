// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GameItems is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from token ID to item type
    mapping(uint256 => string) private _itemTypes;
    
    // Mapping from token ID to metadata URI
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("SoftCore Game Items", "SCGI") {}

    function mintItem(
        address player,
        string memory itemType,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(player, newItemId);
        _itemTypes[newItemId] = itemType;
        _tokenURIs[newItemId] = tokenURI;

        return newItemId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    function getItemType(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _itemTypes[tokenId];
    }
}