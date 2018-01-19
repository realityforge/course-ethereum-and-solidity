pragma solidity ^0.4.17;

contract Lottery {
  address public manager;
  address[] public entries;

  function Lottery() public {
    // msg is a global object that is available from any function
    // it has several fields including the following.
    // msg.data (bytes): complete calldata
    // msg.gas (uint): remaining gas
    // msg.sender (address): sender of the message (current call)
    // msg.sig (bytes4): first four bytes of the calldata (i.e. function identifier)
    // msg.value (uint): number of wei sent with the message

    // documentation url: http://solidity.readthedocs.io/en/develop/units-and-global-variables.html#block-and-transaction-properties
    manager = msg.sender;
  }

  function enter() public payable {
    // Require is invariant check that will abort call if
    // boolean condition returns false
    require(msg.value >= 0.1 ether);

    // Record participant in lottery
    entries.push(msg.sender);
  }

  function pickWinner() public {
    // Randomly select a "winner"
    uint index = random() % entries.length;
    address winner = entries[index];

    // "transfer" is a function on address type
    // this.balance gets the amount of money from current contract
    // Thus this next line transfers all money from current contract to winner
    winner.transfer(this.balance);

    // Reset the set of entrants in the lottery
    // i.e. create a new dynamic array of size 0
    entries = new address[](0);
  }

  function random() private view returns (uint256) {
    // Create a psuedo random number by combining some values
    // that are difficult to predict but still not really random
    // NOTE: IN real world this would not be acceptable as the miner
    // could re-order transactions/change processing time to influence
    // outcome
    //keccak256 == sha3 but the sha3 function is deprecated
    return uint(keccak256(block.difficulty, block.timestamp, entries));
  }
}
