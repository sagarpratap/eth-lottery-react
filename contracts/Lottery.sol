pragma solidity ^0.8.7;
//import "hardhat/console.sol";


contract Lottery {
    address public organiser;
    address public winner;
    address payable [] public players;

    //assign lottery organiser to contract creator
    constructor() {
        organiser = msg.sender;
    }

    //add player's address to the lottery pool
    function enter() public payable {
        require(msg.value == 1 ether);

        players.push(payable(msg.sender));
    }

    //get list of players in the lottery
    function getPlayers() public view returns (address payable [] memory) {
        return players;
    }

    //get lottery value in eth
    function getValue() public view returns(uint) {
        return address(this).balance;
    }    

    //get organiser's address in the lottery
    function getOrganiser() public view returns (address) {
        return organiser;
    }

    //Modifier to check that the organiser is the one calling the method to pick winner
    modifier organiserOnly() {
        require(msg.sender == organiser);
        _;
    }

    //Modifier to check that the organiser is the one calling the method to pick winner
    modifier lotteryHasBalance() {
        require(address(this).balance > 0);
        _;
    }    

    //Method to generate pseudo random number which uses block timestamp
    function randomize() public view returns(uint) {
        //use keccak256 hashnpm
        //hash block difficulty + timestamp + player list
        bytes32 hash = keccak256(abi.encodePacked(block.difficulty, block.timestamp, players));

        return uint(hash);
    }


    function runLottery() public payable organiserOnly lotteryHasBalance returns (address player) {
        //get random winning index using modulo of number of players
        uint winnerIndex = randomize() % players.length;

        players[winnerIndex].transfer(address(this).balance);

        winner = players[winnerIndex];

        //zerolise player list
       // players = new address payable [](0);

        return players[winnerIndex];
    }

    function getWinner() public view returns (address) {
    return winner;
    }
}