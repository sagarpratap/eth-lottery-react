import React, { Component } from "react";
import LotteryContract from "./contracts/Lottery.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { players: null, currentAccount: null, lotteryValue: 0, organiser: null, lotteryWinner: null, web3: null, accounts: null,  contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // get current account
      const defaultAccount = accounts[0];

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LotteryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        LotteryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.initContract, this.getPlayers);

    // Get the value from the contract to prove it worked.
    const response = await instance.methods.getValue().call();

    // Update state with the result.
    this.setState({ lotteryValue: response, currentAccount: defaultAccount });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  initContract = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
   // await contract.methods.set(100).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const organiser = await contract.methods.getOrganiser().call();

    // Get the value from the contract to prove it worked.
    const balance = await contract.methods.getValue().call();

    // Update state with the result.
    this.setState({ organiser: organiser, lotteryValue: balance });
  };


  getPlayers = async () => {
    const { accounts, contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getPlayers().call();

    // Update state with the result.
    this.setState({ players: response });
  };  


  // newUserEntry = async() =>{
  //   const { accounts, contract } = this.state;

  //   await contract.methods.enter().send({from:accounts[0], value: 1000000000000000000});

  // };


  newUserEntry = async() =>{
    const { accounts, contract } = this.state;

    await contract.methods.enter().send({from:accounts[0], value: 1000000000000000000});

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getValue().call();

    // Update state with the result.
    this.setState({ lotteryValue: response });
  };

  runLottery = async() =>{
    const { accounts, contract } = this.state;

    await contract.methods.runLottery().send({from:accounts[0]});

    // Get the value from the contract to prove it worked.
    const winner = await contract.methods.getWinner().call();

    // Get the value from the contract to prove it worked.
    const balance = await contract.methods.getValue().call();

    // Update state with the result.
    this.setState({ lotteryWinner: winner, lotteryBalance: balance });
  };

  isWinnerAnnounced = () =>
  {
    const hasWinner = this.state.lotteryWinner != null;
    if(hasWinner)
    return <h3>Winner not announced yet!</h3>;
    else return <h3>Winner is {this.state.lotteryWinner}</h3>;
  }

  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Detected your metamask account {this.state.currentAccount}</p>
        <h2>Lottery Smart Contract</h2>
        <div>Organiser address is {this.state.organiser}</div>
        <div> <h3>Total Lottery Value is {this.state.lotteryValue/1000000000000000000} ETH </h3> </div>

        {/* <div>
          <h3>Lottery Participants</h3>
          {this.state.players}
        </div> */}
        <h3>
          Press the button to enter the lottery. Entry cost 1 ETH
        </h3>

        <button onClick={this.newUserEntry}>Enter lottery</button>

        <h3>
          Run Lottery (Requires Organiser)
        </h3>

        <button onClick={this.runLottery}>Run Lottery</button>

        <div>
         <h3>{this.state.lotteryWinner == null ? 'No winner yet!' : 'Winner is ' + this.state.lotteryWinner}</h3>
        </div>        


      </div>
    );
  }
}

export default App;
