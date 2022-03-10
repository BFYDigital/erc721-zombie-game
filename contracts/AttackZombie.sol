// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ZombieToken.sol";

contract AttackZombie is ZombieToken {
    uint256 private _randNonce = 0;
    uint256 VICTORY_PROBABILITY = 65;

    event Victory(address indexed attacker, uint256 zombieId, uint256 targetId);
    event Loss(address indexed attacker, uint256 zombieId, uint256 targetId);

    function _calculateVictoryProbability() internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, _randNonce)
                )
            ) % 100;
    }

    function attack(uint256 _zombieId, uint256 _targetId)
        external
        virtual
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
        uint256 chance = (_calculateVictoryProbability() + zombie.level);
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

    function isReady(uint256 _zombieId, uint32 _timestamp)
        public
        view
        returns (bool)
    {
        return _isReady(_zombieId, _timestamp);
    }

    function restZombie(uint256 _zombieId) external {
        zombies[_zombieId].cooldownTime = uint32(
            block.timestamp - COOLDOWN_TIME
        );
    }
}
