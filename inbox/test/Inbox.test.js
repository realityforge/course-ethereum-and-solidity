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

  // Parameter for contract constructor
  const initialMessage = 'Hi there!';

  // deploy the contract
  contract = await
    // Parse ABI and load into local contract
    new web3.eth.Contract(JSON.parse(interface))
    // Tells web3 to create a message that deploys a new contract instance
    .deploy({ data: bytecode, arguments: [initialMessage] })
    // Tells web3 to send out transaction containing the message  defined above
    .send({ from: account, gas: '1000000' });

  contract.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    // non-null address means the contract successfully
    // deployed. Lots of other fields on inbox that contain
    // other useful details.
    assert.ok(contract.options.address);
  });

  it('has a message equal to initial message after construction', async() => {
    const message = await
      // inbox is contract wrapper, methods are the list of methods defined by contract ABI
      contract.methods
           // message() is the setup of the method call and includes any parameters that
           // you want to pass to the contract
           .message()
           // call is the method that invokes the method on network. If it was a transaction
           // would pass transaction parameters here.
           .call();
    assert.equal(message, 'Hi there!');
  });

  it('can change the message via setMessage', async() => {
    await
      contract.methods
           // Method on contract
           .setMessage('bye')
           // transaction attributes. Note that this is send() rather than call to
           // indicate different type of method
           .send({ from: accounts[0] });
    const message = await contract.methods.message().call();
    assert.equal(message, 'bye');
  });
});
