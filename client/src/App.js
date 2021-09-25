import React, { Component } from "react";
import LotteryContract from "./contracts/Lottery.json";
import getWeb3 from "./getWeb3";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';


import "./App.css";

class App extends Component {
  state = { players: null, currentAccount: null, lotteryValue: 0, organiser: null, lotteryWinner: null, web3: null, accounts: null,  contract: null };

  componentDidMount = async () => {
    try {
      //const classes = useStyles();
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0]);

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
    this.setState({ organiser: organiser, lotteryValue: balance, isOrganiser:organiser == accounts[0] });
    
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
      <React.Fragment>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <Icon className="logo">videogame_asset</Icon>
            <Typography variant="h6" color="inherit" noWrap>
                Lucky Draw Smart Contract
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <div className="heroContent">
            <Container maxWidth="sm">
              <Typography component="h1" variant="h2" align="center" color="white" gutterBottom>
                Lucky Draw Smart Contract
              </Typography>
              <Typography variant="h5" align="center" color="white" paragraph>
                
              </Typography>
              
            </Container>
          </div>
        </main>
        <div className="App">
        <div className="heroButtons">
                <Grid container spacing={2} justifyContent="center">
                  <Grid className={this.state.isOrganiser ? 'hidden' : undefined} item>
                  
                    <Button onClick={this.newUserEntry} variant="contained" color="primary">
                      Enter Lucky Draw
                    </Button>
                  </Grid>
                  <Grid className={this.state.isOrganiser ? undefined:'hidden'} item>
                    <Button onClick={this.runLottery} variant="outlined" color="primary">
                      Pick Winner
                    </Button>
                  </Grid>
                </Grid>
              </div>
          {/*<div>Organiser address is {this.state.organiser}</div>
          <div>current is {this.state.accounts[0]}</div>*/}
          <div> <h3>Lottery value is {this.state.lotteryValue/1000000000000000000} ether </h3> </div>

         
         

          <div>
          <h3>{this.state.lotteryWinner == null ? 'No winner yet!' : 'Winner is ' + this.state.lotteryWinner}</h3>
          </div>        


        </div>
      </React.Fragment>
    );
  }
}

export default App;
