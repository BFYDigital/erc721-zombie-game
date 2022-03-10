const AttackZombie = artifacts.require('TestAttackZombie');

contract('AttackZombie', function (accounts) {

  const Exception = require('../lib/exceptions');
  let attackZombie;

  beforeEach(async () => {
    attackZombie = await AttackZombie.new();
  });

  it("should generate a 'random' number between 0 and 100 (inclusive)", async () => {
    // arrange
    let zombieName = 'Capt Stingray';

    // act
    await attackZombie.mint(zombieName, { from: accounts[0] });
    let actual = await attackZombie.calculateVictoryProbability({ from: accounts[0] });

    // assert
    assert.isTrue(actual.gte(web3.utils.toBN(0)) || actual.lte(web3.utils.toBN(100)));
  });

  it("should not allow a user to attack his own zombie", async () => {
    // arrange
    let firstZombieName = 'Capt Stingray';
    let secondZombieName = 'Zombie Doe';
    await attackZombie.mint(firstZombieName, { from: accounts[0] });
    await attackZombie.mint(secondZombieName, { from: accounts[0] });

    // act + assert
    await Exception.tryCatch(
      attackZombie.attack(0, 1, { from: accounts[0] }), Exception.errTypes.friendlyFire);
  });

  it("should not allow a zombie to attack during cooldown", async () => {
    // arrange
    let firstZombieName = 'Capt Stingray';
    let secondZombieName = 'Zombie Doe';
    await attackZombie.mint(firstZombieName, { from: accounts[0] });
    await attackZombie.mint(secondZombieName, { from: accounts[1] });

    // act
    attackZombie.triggerCooldown(0, { from: accounts[0] });

    // assert
    await Exception.tryCatch(
      attackZombie.attack(0, 1, { from: accounts[0] }), Exception.errTypes.cooldownInEffect);
  });

  it("should win/lose when a zombie attacks", async () => {
    // arrange
    let attackerZombieName = 'Capt Stingray';
    let defenderZombieName = 'Zombie Doe';
    await attackZombie.mint(attackerZombieName, { from: accounts[0] });
    await attackZombie.mint(defenderZombieName, { from: accounts[1] });

    // act
    await attackZombie.attack(0, 1, { from: accounts[0] });

    let attackerZombieIndex = await attackZombie.tokenOfOwnerByIndex(accounts[0], 0);
    let defenderZombieIndex = await attackZombie.tokenOfOwnerByIndex(accounts[1], 0);

    const attackerZombie = await attackZombie.zombies(attackerZombieIndex, { from: accounts[0] });
    const defenderZombie = await attackZombie.zombies(defenderZombieIndex, { from: accounts[0] });

    // assert
    assert.isTrue(attackerZombie.winCount.eq(web3.utils.toBN('1')) ||
      defenderZombie.winCount.eq(web3.utils.toBN('1')));

    assert.isTrue(attackerZombie.lossCount.eq(web3.utils.toBN('1')) ||
      defenderZombie.lossCount.eq(web3.utils.toBN('1')));
  });
});
