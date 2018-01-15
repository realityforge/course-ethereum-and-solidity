const assert = require('assert');
const ganache = require('ganache-cli');

//Web3 module returns a constructor function.
// We then use the constructor to create instance and connect it to specific networks
const Web3 = require('web3');

// And here's that instance
const web3 = new Web3(ganache.provider());

// Destructure the compiled output of the smart contract
const { interface, bytecode } = require('../compile');

beforeEach(() => {
});

describe('Inbox', () => {
  it('deploys a contract', () => {
  });

  it('has a message equal to initial message after construction', () => {
  });

  it('can change the message via setMessage', () => {
  });
});
