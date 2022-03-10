// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FeedingZombie.sol";

contract TestFeedingZombie is FeedingZombie {
    uint256 private _randNonce = 0;

    function test_subtractSecondsFromLastFeedingTime(
        uint256 _zombieId,
        uint256 _seconds
    ) external {
        zombies[_zombieId].lastFeedingTime = uint32(
            zombies[_zombieId].lastFeedingTime - _seconds
        );
    }
}
