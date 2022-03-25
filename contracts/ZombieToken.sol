// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ZombieToken is Ownable, ERC721, ERC721Enumerable {
    struct Zombie {
        uint256 id;
        string name;
        uint256 dna;
        uint8 level;
        uint32 cooldownTime;
        uint16 winCount;
        uint16 lossCount;
        uint32 lastFeedingTime;
    }

    event ZombieCreated(address indexed owner, uint256 zombieId);

    uint256 DNA_DIGITS = 16;
    uint256 DNA_MODULUS = 10**DNA_DIGITS;
    uint32 COOLDOWN_TIME = 1 days;

    Zombie[] public zombies;

    mapping(string => bool) _zombieNameExists;

    constructor() ERC721("BFY Zombie", "BFYZMB") {}

    modifier onlyOwnerOf(uint256 _zombieId) {
        require(
            msg.sender == ownerOf(_zombieId),
            "Only the owner of this zombie can perform this action"
        );
        _;
    }

    function mint(string memory _name) public {
        _createZombie(_name);
        uint256 id = zombies.length - 1;

        _safeMint(msg.sender, id);
    }

    function _createZombie(string memory _name) internal {
        require(
            _zombieNameExists[_name] == false,
            "A zombie with this name already exists!"
        );
        require(
            keccak256(abi.encodePacked(_name)) !=
                keccak256(abi.encodePacked("")),
            "A zombie name is required!"
        );

        uint256 id = zombies.length;
        uint256 dna = _generateDna(_name);
        zombies.push(
            Zombie(
                id,
                _name,
                dna,
                1,
                uint32(block.timestamp),
                0,
                0,
                uint32(block.timestamp)
            )
        );
        _zombieNameExists[_name] = true;

        emit ZombieCreated(msg.sender, id);
    }

    function _generateDna(string memory _name) internal view returns (uint256) {
        uint256 rand = uint256(
            keccak256(abi.encodePacked(_name, block.timestamp))
        );
        return rand % DNA_MODULUS;
    }

    function getEnemyZombies() external view returns (Zombie[] memory) {
        // Zombie[] storage enemyZombies;
        uint256 resultCount;
        for (uint256 i = 0; i < zombies.length; i++) {
            address ownerAddr = ownerOf(i);
            if (msg.sender != ownerAddr && ownerAddr != address(0)) {
                resultCount++;
            }
        }

        Zombie[] memory enemyZombies = new Zombie[](resultCount);
        uint256 j;

        for (uint256 i = 0; i <= enemyZombies.length; i++) {
            address ownerAddr = ownerOf(i);
            if (msg.sender != ownerAddr && ownerAddr != address(0)) {
                enemyZombies[j] = zombies[i];
                j++;
            }
        }

        return enemyZombies;
    }

    function levelUp(uint256 _zombieId) public payable onlyOwnerOf(_zombieId) {
        require(zombies[_zombieId].level < 10, "You are at the max level");
        require(
            msg.value >= (15 * 10**16),
            "It costs 0.5 eth to level up your zombie"
        );

        zombies[_zombieId].level++;
    }

    function getZombieCooldownTime(uint256 _zombieId)
        public
        view
        returns (uint32)
    {
        return zombies[_zombieId].cooldownTime;
    }

    function _triggerCooldown(uint256 _zombieId) internal {
        zombies[_zombieId].cooldownTime = uint32(
            block.timestamp + COOLDOWN_TIME
        );
    }

    function _isReady(uint256 _zombieId, uint32 _timestamp)
        internal
        view
        returns (bool)
    {
        // return (zombies[_zombieId].cooldownTime <= block.timestamp);
        return (zombies[_zombieId].cooldownTime <= _timestamp);
    }

    function getUserOwnedTokenIds(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory _tokens = new uint256[](balanceOf(_owner));

        for (uint256 i = 0; i < balanceOf(_owner); i++) {
            _tokens[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return _tokens;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
