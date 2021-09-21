import React, { Component } from "react";
import LotteryContract from "./contracts/Lottery.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { lotteryValue: 0, organiser: null, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LotteryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        LotteryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
   // await contract.methods.set(100).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getOrganiser().call();

    // Update state with the result.
    this.setState({ organiser: response });
  };


  newUserEntry = async() =>{
    const { accounts, contract } = this.state;

    await contract.methods.enter().send({from:accounts[0], value: 1000000000000000000});

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getValue().call();

    // Update state with the result.
    this.setState({ lotteryValue: response });
  };




  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Lottery Smart Contract</h2>
        <div>Organiser address is {this.state.organiser}</div>
        <div> <h3>Lottery value is {this.state.lotteryValue/1000000000000000000} ether </h3> </div>

        <h3>
          Press the button to enter the lottery
        </h3>

        <button onClick={this.newUserEntry}>Enter lottery</button>

      </div>
    );
  }
}

export default App;
