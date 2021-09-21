const Lottery = artifacts.require("./Lottery.sol");

contract("Lottery", accounts => {
  it("...should store the value 1 eth.", async () => {
    const lotteryInstance = await Lottery.deployed();

    // Enter
    await lotteryInstance.enter({from: accounts[0], value: 1000000000000000000 });

    // Get stored value
    const lotteryValue = await lotteryInstance.getValue.call();

    assert.equal(lotteryValue, 1000000000000000000, "The value 1000000000000000000 was stored.");
  });
});
