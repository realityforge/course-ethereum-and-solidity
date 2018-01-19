const assert = require('assert');
const ganache = require('ganache-cli');

//Web3 module returns a constructor function.
// We then use the constructor to create instance and connect it to specific networks
const Web3 = require('web3');

const provider = ganache.provider();

// And here's that instance
const web3 = new Web3(provider);

// Destructure the compiled output of the smart contract
const { interface, bytecode } = require('../compile');

let accounts;
let contract;

beforeEach(async() => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // select an account to deploy from. Rather arbitrarily chose first
  const account = accounts[0];

  // deploy the contract
  contract = await
    // Parse ABI and load into local contract
    new web3.eth.Contract(JSON.parse(interface))
    // Tells web3 to create a message that deploys a new contract instance
    .deploy({ data: bytecode, arguments: [] })
    // Tells web3 to send out transaction containing the message  defined above
    .send({ from: account, gas: '1000000' });

  contract.setProvider(provider);
});

describe('Lottery', () => {
  it('deploys a contract', () => {
    // non-null address means the contract successfully
    // deployed. Lots of other fields on inbox that contain
    // other useful details.
    assert.ok(contract.options.address);
  });
});
