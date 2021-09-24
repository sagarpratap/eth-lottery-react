var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Lottery = artifacts.require("./Lottery.sol");

module.exports = function(deployer, network, accounts) {
  let platform = accounts[0];

  deployer.deploy(SimpleStorage);
  deployer.deploy(Lottery, {from:platform});
};
