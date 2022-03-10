// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./AttackZombie.sol";

contract FeedingZombie is AttackZombie {
    uint256 private _randNonce = 0;

    function attack(uint256 _zombieId, uint256 _targetId)
        external
        virtual
        override
        onlyOwnerOf(_zombieId)
    {
        // check if the user is trying to attack his own zombie
        require(
            ownerOf(_targetId) != msg.sender,
            "You cannot attack you own zombie!"
        );

        // check if zombie is ready to attack
        require(
            _isReady(_zombieId, uint32(block.timestamp)),
            "Your zombie is resting!"
        );

        Zombie storage zombie = zombies[_zombieId];
        Zombie storage emeny = zombies[_targetId];

        _randNonce++;
        uint8 hungerLevel = getHungerLevel(_zombieId, uint32(block.timestamp));
        uint8 hungerPenalty = (hungerLevel == 0) ? 0 : (hungerLevel / 10);

        uint256 chance = (_calculateVictoryProbability() +
            zombie.level -
            hungerPenalty);
        // attack successsful
        if (chance <= VICTORY_PROBABILITY) {
            zombie.winCount++;
            emeny.lossCount++;

            emit Victory(msg.sender, _zombieId, _targetId);
        }
        // attack failed
        else {
            zombie.lossCount++;
            emeny.winCount++;
            _triggerCooldown(_zombieId);

            emit Loss(msg.sender, _zombieId, _targetId);
        }
    }

    function feed(uint256 _zombieId) public {
        uint256 rand = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, _zombieId))
        ) % 10;
        uint256 offset = uint256(1 hours) + rand;
        offset = (offset >= 1 days) ? 23 hours : offset;
        zombies[_zombieId].lastFeedingTime = uint32(block.timestamp - offset);
    }

    function getHungerLevel(uint256 _zombieId, uint32 _timestamp)
        public
        view
        returns (uint8)
    {
        uint32 interval = uint32(
            _timestamp - zombies[_zombieId].lastFeedingTime
        );
        return uint8((interval >= 86400) ? 100 : interval / 864);
    }

    function makeZombieHungry(uint256 _zombieId) external {
        zombies[_zombieId].lastFeedingTime = uint32(
            zombies[_zombieId].lastFeedingTime - uint32(2 hours)
        );
    }
}
