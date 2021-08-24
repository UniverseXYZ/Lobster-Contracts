// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ERC721PresetMinterPauserAutoId.sol";
import "./ILobster.sol";
import "./LobsterGeneGenerator.sol";

contract Lobster is ILobster, ERC721PresetMinterPauserAutoId, ReentrancyGuard {
    using LobsterGeneGenerator for LobsterGeneGenerator.Gene;
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    LobsterGeneGenerator.Gene internal geneGenerator;

    address payable public daoAddress;
    uint256 public lobsterPrice;
    uint256 public maxSupply;
    uint256 public bulkBuyLimit;
    string public arweaveAssetsJSON;

    event TokenMorphed(
        uint256 indexed tokenId,
        uint256 oldGene,
        uint256 newGene,
        uint256 price,
        Lobster.LobsterEventType eventType
    );
    event TokenMinted(uint256 indexed tokenId, uint256 newGene);
    event PolymorphPriceChanged(uint256 newPolymorphPrice);
    event MaxSupplyChanged(uint256 newMaxSupply);
    event BulkBuyLimitChanged(uint256 newBulkBuyLimit);
    event BaseURIChanged(string baseURI);
    event arweaveAssetsJSONChanged(string arweaveAssetsJSON);

    enum LobsterEventType {
        MINT,
        TRANSFER
    }

    // Optional mapping for token URIs
    mapping(uint256 => uint256) internal _genes;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        address payable _daoAddress,
        uint256 _lobsterPrice,
        uint256 _maxSupply,
        uint256 _bulkBuyLimit,
        string memory _arweaveAssetsJSON
    ) public ERC721PresetMinterPauserAutoId(name, symbol, baseURI) {
        daoAddress = _daoAddress;
        lobsterPrice = _lobsterPrice;
        maxSupply = _maxSupply;
        bulkBuyLimit = _bulkBuyLimit;
        arweaveAssetsJSON = _arweaveAssetsJSON;
        geneGenerator.random();
    }

    modifier onlyDAO() {
        require(msg.sender == daoAddress, "Not called from the dao");
        _;
    }

    function geneOf(uint256 tokenId)
        public
        view
        virtual
        override
        returns (uint256 gene)
    {
        return _genes[tokenId];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721PresetMinterPauserAutoId) {
        ERC721PresetMinterPauserAutoId._beforeTokenTransfer(from, to, tokenId);
        emit TokenMorphed(
            tokenId,
            _genes[tokenId],
            _genes[tokenId],
            0,
            LobsterEventType.TRANSFER
        );
    }

    function mint() public payable override nonReentrant {
        require(_tokenIdTracker.current() < maxSupply, "Total supply reached");

        _tokenIdTracker.increment();

        uint256 tokenId = _tokenIdTracker.current();
        _genes[tokenId] = geneGenerator.random();

        (bool transferToDaoStatus, ) = daoAddress.call{value: lobsterPrice}("");
        require(
            transferToDaoStatus,
            "Address: unable to send value, recipient may have reverted"
        );

        uint256 excessAmount = msg.value.sub(lobsterPrice);
        if (excessAmount > 0) {
            (bool returnExcessStatus, ) = _msgSender().call{
                value: excessAmount
            }("");
            require(returnExcessStatus, "Failed to return excess.");
        }

        _mint(_msgSender(), tokenId);

        emit TokenMinted(tokenId, _genes[tokenId]);
        emit TokenMorphed(
            tokenId,
            0,
            _genes[tokenId],
            lobsterPrice,
            LobsterEventType.MINT
        );
    }

    function bulkBuy(uint256 amount) public payable override nonReentrant {
        require(
            amount <= bulkBuyLimit,
            "Cannot bulk buy more than the preset limit"
        );
        require(
            _tokenIdTracker.current().add(amount) <= maxSupply,
            "Total supply reached"
        );

        (bool transferToDaoStatus, ) = daoAddress.call{
            value: lobsterPrice.mul(amount)
        }("");
        require(
            transferToDaoStatus,
            "Address: unable to send value, recipient may have reverted"
        );

        uint256 excessAmount = msg.value.sub(lobsterPrice.mul(amount));
        if (excessAmount > 0) {
            (bool returnExcessStatus, ) = _msgSender().call{
                value: excessAmount
            }("");
            require(returnExcessStatus, "Failed to return excess.");
        }

        for (uint256 i = 0; i < amount; i++) {
            _tokenIdTracker.increment();

            uint256 tokenId = _tokenIdTracker.current();
            _genes[tokenId] = geneGenerator.random();
            _mint(_msgSender(), tokenId);

            emit TokenMinted(tokenId, _genes[tokenId]);
            emit TokenMorphed(
                tokenId,
                0,
                _genes[tokenId],
                lobsterPrice,
                LobsterEventType.MINT
            );
        }
    }

    function lastTokenId() public view override returns (uint256 tokenId) {
        return _tokenIdTracker.current();
    }

    function mint(address to)
        public
        pure
        override(ERC721PresetMinterPauserAutoId)
    {
        revert("Should not use this one");
    }

    function setPolymorphPrice(uint256 newPolymorphPrice)
        public
        virtual
        override
        onlyDAO
    {
        lobsterPrice = newPolymorphPrice;

        emit PolymorphPriceChanged(newPolymorphPrice);
    }

    function setMaxSupply(uint256 _maxSupply) public virtual override onlyDAO {
        maxSupply = _maxSupply;

        emit MaxSupplyChanged(maxSupply);
    }

    function setBulkBuyLimit(uint256 _bulkBuyLimit)
        public
        virtual
        override
        onlyDAO
    {
        bulkBuyLimit = _bulkBuyLimit;

        emit BulkBuyLimitChanged(_bulkBuyLimit);
    }

    function setBaseURI(string memory _baseURI) public virtual onlyDAO {
        _setBaseURI(_baseURI);

        emit BaseURIChanged(_baseURI);
    }

    function setArweaveAssetsJSON(string memory _arweaveAssetsJSON)
        public
        virtual
        onlyDAO
    {
        arweaveAssetsJSON = _arweaveAssetsJSON;

        emit arweaveAssetsJSONChanged(_arweaveAssetsJSON);
    }

    receive() external payable {
        mint();
    }
}
