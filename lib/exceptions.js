/*
 * source: https://ethereum.stackexchange.com/a/48629 
 */

const PREFIX = "Reason given: ";

module.exports.errTypes = {
  duplicateZombieName: "A zombie with this name already exists!",
  zombieNameRequired: "A zombie name is required!",
  friendlyFire: "You cannot attack you own zombie!",
  cooldownInEffect: "Your zombie is resting!",
  insufficientLevelUpCost: "It costs 0.5 eth to level up your zombie",
  maxLevel: "You are at the max level",
}

module.exports.tryCatch = async function (promise, errType) {
  try {
    await promise;
    throw null;
  }
  catch (error) {
    assert(error, "Expected an error but did not get one");
    assert(error.message.includes(PREFIX + errType), "Expected an error including with '" + PREFIX + errType + "' but got '" + error.message + "' instead");
  }
};