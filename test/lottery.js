const Lottery = artifacts.require("./Lottery.sol");

contract("Lottery", accounts => {
  it("...should return the owner", async () => {
    const lotteryInstance = await Lottery.deployed();

    // Get stored value
    const lotteryOwner = await lotteryInstance.getOrganiser.call();
    console.log(lotteryOwner);

    assert.equal(lotteryOwner, accounts[0], "The organiser is the first account");
  });

  /*
  it("...should store the value  eth.", async () => {
    const lotteryInstance = await Lottery.deployed();

    // Enter
    await lotteryInstance.enter({from: accounts[1], value: 1000000000000000000 });
    await lotteryInstance.enter({from: accounts[2], value: 1000000000000000000 });

    // Get stored value
    const lotteryValue = await lotteryInstance.getValue.call();

    console.log(lotteryValue);
    

    assert.equal(lotteryValue, 2000000000000000000, "The value 2000000000000000000 was stored.");
  });
*/

  it("should succeed", async function() {
    // wrap what you want to debug with `debug()`:
    const lotteryInstance = await Lottery.deployed();

    // Enter
    await lotteryInstance.enter({from: accounts[1], value: 1000000000000000000 });
    await lotteryInstance.enter({from: accounts[2], value: 1000000000000000000 });
    
    //await debug( lotteryInstance.pickWinner({ from: accounts[0] }) );
    const lotteryWinner = await lotteryInstance.runLottery({ from: accounts[0] });
    console.log(lotteryWinner);
    //           ^^^^^^^^^^^^^^^^^^ wrap contract operation ^^^^^^^^^^^^^^
  });

  it("...should return the winner", async () => {
    const lotteryInstance = await Lottery.deployed();

    // Get stored value
    const lotteryWinner = await lotteryInstance.getWinner.call();
    console.log(lotteryWinner);

    assert.notEqual(lotteryWinner, "0x00", "The winner is not empty");
  });
});
