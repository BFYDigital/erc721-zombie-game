const FeedingZombie = artifacts.require("FeedingZombie");

module.exports = function (deployer) {
  deployer.deploy(FeedingZombie);
};
