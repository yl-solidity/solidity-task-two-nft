
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/ERC721/Ownable.sol";
import "@openzeppelin/contracts/utils/ERC721/Counters.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counters;
    Counters.Counter private _tokenIdCounter;

    event Minted(address sender, address to, uint256 tokenId, uint256 timestamp);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {
        // 构造函数
    }
    
    /**
     * 安全铸造
     */
    function safeMint(address to, string memory uri) public onlyOwner returns(uint256){
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to,tokenId);
        _setTokenURI(tokenId, uri);
         emit Minted(sender, to, tokenId, timestamp);
        return tokenId;
    }
    /**
     * 非安全铸造函数
     */
    function mint(address recipient, string memory _tokenURI) public onlyOwner returns(uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        emit Minted(sender, to, tokenId, timestamp);
        return tokenId;
    }

    /**
     * 批量铸造
     */
    function mintBatch(address[] memory to, string[] memory uris) public onlyOwner {
        require(to.length == uris.length, "Arrays length mismatch");

        uint16 length = to.length;
        for(uint256 i =0; i<length; i++){
            mint(to[i], uris[i]);
        }
    }
    /**
     * 获取当前tokenid   
     */
    function getCurrentTokenId() public view returns(uint256) {
        return _tokenIdCounter.current();
    }
    /**
     * 重写获取 NFT 的元数据链接函数，因为ERC721, ERC721URIStorage都有tokenURI函数
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns(string memory) {
        return super.tokenURI(tokenId);
    }
    /**
     * 重写接口检测函数，因为ERC721, ERC721URIStorage都有supportsInterface函数
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns(bool) {
        return super.supportsInterface(interfaceId);
    }
}