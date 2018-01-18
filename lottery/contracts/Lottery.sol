pragma solidity ^0.4.17;

contract Lottery {
  address public manager;

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
}
