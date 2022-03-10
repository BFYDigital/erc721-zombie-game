require('truffle-test-utils').init();
const ZombieToken = artifacts.require('TestZombieToken');

contract('ZombieToken', function (accounts) {

  const Exception = require('../lib/exceptions');
  let zombieToken;

  beforeEach(async () => {
    zombieToken = await ZombieToken.new();
  });

  it("should create a zombie", async () => {
    // arrange
    let zombieName = 'Capt Stingray';

    // act
    let result = await zombieToken.createZombie(zombieName, { from: accounts[0] });

    // assert
    assert.web3Event(result, {
      event: 'ZombieCreated',
      args: {
        "0": accounts[0], // owner
        "1": 0, // zombieId
        "__length__": 2,
        "owner": "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
        "zombieId": 0
      }
    }, 'The event `ZombieCreated` is emitted');
  });

  it("should not allow zombie creation with duplicate names", async () => {
    // arrange
    let zombieName = 'Capt Stingray';

    // act + assert
    await zombieToken.createZombie(zombieName, { from: accounts[0] });
    await Exception.tryCatch(
      zombieToken.createZombie(zombieName, { from: accounts[0] }), Exception.errTypes.duplicateZombieName);
  });

  it("should not allow zombie creation without zombie name", async () => {
    // act + assert
    await Exception.tryCatch(
      zombieToken.createZombie('', { from: accounts[0] }), Exception.errTypes.zombieNameRequired);
  });

  it("should generate a 16 digit DNA", async () => {
    // arrange
    let zombieName = 'Capt Stingray';

    // act
    let dnaBN = await zombieToken.generateDna({ from: accounts[0] });
    let dna = dnaBN.toString();

    // assert
    assert.equal(dna.length, 16);
  });

  it("should get cooldown time for existing zombies", async () => {
    // arrange
    let zombieName = 'Capt Stingray';

    // act
    let result = await zombieToken.mint(zombieName, { from: accounts[0] });
    let cooldownTime = await zombieToken.getZombieCooldownTime(0, { from: accounts[0] });
    let block = await web3.eth.getBlock(result.receipt.blockNumber);
    let expected = web3.utils.toBN(block.timestamp.toString());

    // assert
    assert.isTrue(cooldownTime.eq(expected));
  });

  it("should not be ready after cooldown trigger", async () => {
    // arrange
    let zombieName = 'Capt Stingray';
    let currentTimestamp = Math.floor(new Date().getTime() / 1000);

    // act
    await zombieToken.mint(zombieName, { from: accounts[0] });
    await zombieToken.triggerCooldown(0, { from: accounts[0] });
    let isReady = await zombieToken.isReady(0, currentTimestamp, { from: accounts[0] });

    // assert

    assert.isNotTrue(isReady);
  });

  it("should reset cooldown period", async () => {
    // arrange
    let zombieName = 'Capt Stingray';
    let currentTimestamp = Math.floor(new Date().getTime() / 1000);

    // act
    await zombieToken.mint(zombieName, { from: accounts[0] });
    let initialCooldownTime = await zombieToken.getZombieCooldownTime(0, { from: accounts[0] });
    await zombieToken.triggerCooldown(0, { from: accounts[0] });
    let finalCooldownTime = await zombieToken.getZombieCooldownTime(0, { from: accounts[0] });
    let isReady = await zombieToken.isReady(0, currentTimestamp, { from: accounts[0] });

    // assert
    assert.isTrue(finalCooldownTime.gt(initialCooldownTime));
    assert.isNotTrue(isReady);
  });

  it("should create a zombie which is ready", async () => {
    // arrange
    let zombieName = 'Capt Stingray';

    // act
    await zombieToken.mint(zombieName, { from: accounts[0] });
    let isReady = await zombieToken.isReady(0, { from: accounts[0] });

    // assert
    assert.isTrue(isReady);
  });

  it("should return an array of the users zombies", async () => {
    // act
    await zombieToken.mint('zombie 1', { from: accounts[0] });
    await zombieToken.mint('zombie 2', { from: accounts[1] });
    await zombieToken.mint('zombie 3', { from: accounts[0] });
    await zombieToken.mint('zombie 4', { from: accounts[1] });
    await zombieToken.mint('zombie 5', { from: accounts[0] });
    await zombieToken.mint('zombie 6', { from: accounts[0] });
    await zombieToken.mint('zombie 7', { from: accounts[0] });

    let tokenIds = await zombieToken.getUserOwnedTokenIds(accounts[0], { from: accounts[0] });

    assert.isArray(tokenIds);
    assert.equal(tokenIds.length, 5);
  });

  it("should allow a zombie to level up", async () => {
    // arrange
    let zombieName = 'Capt Stingray';
    await zombieToken.mint(zombieName, { from: accounts[0] });

    // act
    await zombieToken.levelUp(0, { from: accounts[0], value: web3.utils.toWei('0.15', 'ether') });
    const zombie = await zombieToken.zombies(0, { from: accounts[0] });

    // assert
    assert.isTrue(zombie.level.eq(web3.utils.toBN('2')));
  });

  it("should not allow a zombie to level up with insufficient eth", async () => {
    // arrange
    let zombieName = 'Capt Stingray';
    await zombieToken.mint(zombieName, { from: accounts[0] });

    // act + assert
    await Exception.tryCatch(
      zombieToken.levelUp(0, { from: accounts[0] }), Exception.errTypes.insufficientLevelUpCost);
  });

  it("should not allow a zombie pass level 10", async () => {
    // arrange
    let zombieName = 'Capt Stingray';
    await zombieToken.mint(zombieName, { from: accounts[0] });
    for (let i = 0; i < 10; i++) {
      await zombieToken.levelUp(0, { from: accounts[0], value: web3.utils.toWei('0.15', 'ether') });
    }

    // act + assert
    await Exception.tryCatch(
      zombieToken.levelUp(0, { from: accounts[0], value: web3.utils.toWei('0.15', 'ether') }),
      Exception.errTypes.maxLevel);
  });

  it("should only retrieve enemy zombies", async () => {
    // arrange
    await zombieToken.mint('zombie 1', { from: accounts[0] });
    await zombieToken.mint('zombie 2', { from: accounts[0] });
    await zombieToken.mint('zombie 3', { from: accounts[0] });
    await zombieToken.mint('zombie 4', { from: accounts[1] });
    await zombieToken.mint('zombie 5', { from: accounts[2] });
    await zombieToken.mint('zombie 6', { from: accounts[3] });
    await zombieToken.mint('zombie 7', { from: accounts[4] });
    await zombieToken.mint('zombie 8', { from: accounts[4] });
    let expected = 5;

    // act
    let zombies = await zombieToken.getEnemyZombies({ from: accounts[0] });
    let actual = zombies.length;

    // assert
    assert.equal(actual, expected);
  });
});
