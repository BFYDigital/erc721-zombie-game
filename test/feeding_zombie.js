const FeedingZombie = artifacts.require('TestFeedingZombie');

contract('FeedingZombie', function(accounts) {

  const Exception = require('../lib/exceptions');
  let feedingZombie;

  beforeEach(async () => {
    feedingZombie = await FeedingZombie.new();
  });

  it("should display correct level of hunger", async () => {
    // arrange
    await feedingZombie.mint('zombie 1', { from: accounts[0] });
    await feedingZombie.mint('zombie 2', { from: accounts[0] });
    await feedingZombie.mint('zombie 3', { from: accounts[0] });
    await feedingZombie.mint('zombie 4', { from: accounts[0] });

    // act
    let actual1 = await feedingZombie.getHungerLevel('0', { from: accounts[0] });
    
    await feedingZombie
    .test_subtractSecondsFromLastFeedingTime('1', '86500', { from: accounts[0] });
    let actual2 = await feedingZombie.getHungerLevel('1', { from: accounts[0] });

    await feedingZombie
    .test_subtractSecondsFromLastFeedingTime('2', '43250', { from: accounts[0] });
    let actual3 = await feedingZombie.getHungerLevel('2', { from: accounts[0] });

    await feedingZombie
    .test_subtractSecondsFromLastFeedingTime('3', '21625', { from: accounts[0] });
    let actual4 = await feedingZombie.getHungerLevel('3', { from: accounts[0] });
    
    // assert
    assert.isTrue(actual1.eq(web3.utils.toBN('0')));
    assert.isTrue(actual2.eq(web3.utils.toBN('100')));
    assert.isTrue(actual3.eq(web3.utils.toBN('50')));
    assert.isTrue(actual4.eq(web3.utils.toBN('25')));
  });

  it("should reduce the hunger level after feeding", async () => {
    // arrange
    await feedingZombie.mint('zombie 1', { from: accounts[0] });
    let expected = web3.utils.toBN('100');

    await feedingZombie
    .test_subtractSecondsFromLastFeedingTime('0', '86500', { from: accounts[0] });
    let actual1 = await feedingZombie.getHungerLevel('0', { from: accounts[0] });
    await feedingZombie
    .feedOnCryptoKitty('0', '2', { from: accounts[0] });
    let actual2 = await feedingZombie.getHungerLevel('0', { from: accounts[0] });

    // assert
    assert.isTrue(actual1.eq(expected));
    assert.isTrue(actual2.lt(expected));
  });
});
