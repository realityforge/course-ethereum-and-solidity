const assert = require('assert');
const ganache = require('ganache-cli');

//Web3 module returns a constructor function.
// We then use the constructor to create instance and connect it to specific networks
const Web3 = require('web3');

// And here's that instance
const web3 = new Web3(ganache.provider());

// Destructure the compiled output of the smart contract
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async() => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // select an account to deploy from. Rather arbitrarily chose first
  const account = accounts[0];

  // Parameter for contract constructor
  const initialMessage = 'Hi there!';

  // deploy the contract
  inbox = await
    // Parse ABI and load into local contract
    new web3.eth.Contract(JSON.parse(interface))
    // Tells web3 to create a message that deploys a new contract instance
    .deploy({ data: bytecode, arguments: [initialMessage] })
    // Tells web3 to send out transaction containing the message  defined above
    .send({ from: account, gas: '1000000' });
});

describe('Inbox', () => {
  it('deploys a contract', () => {
  });

  it('has a message equal to initial message after construction', () => {
  });

  it('can change the message via setMessage', () => {
  });
});
