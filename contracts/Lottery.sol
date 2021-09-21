pragma solidity ^0.5.0;

contract Lottery {
    address public organiser = address(this);
    address payable [] public players;

    //assign lottery organiser to contract creator
    function lottery() public payable {
        organiser = msg.sender;
    }

    //add player's address to the lottery pool
    function enter() public payable {
        require(msg.value == 1 ether);

        players.push(msg.sender);
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

    //Method to generate pseudo random number which uses block timestamp
    function randomize() public view returns(uint) {
        //use keccak256 hash
        //hash block difficulty + timestamp + player list
        bytes32 hash = keccak256(abi.encodePacked(block.difficulty, now, players));

        return uint(hash);
    }

    function pickWinner() public payable organiserOnly {
        //get random winning index using modulo of number of players
        //uint winnerIndex = randomize() % players.length;
        uint winnerIndex = 1;

        //transfer lottery pool or contract balance to winning address
        players[winnerIndex].transfer(address(this).balance);

        //zerolise player list
        players = new address payable [](0);
    }

}