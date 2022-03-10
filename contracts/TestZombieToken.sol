// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ZombieToken.sol";

contract TestZombieToken is ZombieToken {
    function createZombie(string memory _name) public {
        _createZombie(_name);
    }

    function generateDna(string memory _name) public view returns (uint256) {
        return _generateDna(_name);
    }

    function triggerCooldown(uint256 _zombieId) public {
        _triggerCooldown(_zombieId);
    }

    function isReady(uint256 _zombieId, uint32 _timestamp)
        public
        view
        returns (bool)
    {
        return _isReady(_zombieId, _timestamp);
    }
}
