// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./AttackZombie.sol";

contract TestAttackZombie is AttackZombie {
    function calculateVictoryProbability() public view returns (uint256) {
        return _calculateVictoryProbability();
    }

    function triggerCooldown(uint256 _zombieId) public {
        _triggerCooldown(_zombieId);
    }
}
