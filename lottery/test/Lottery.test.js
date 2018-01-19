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
  it('allows one account to enter', async() => {
    const sourceAccount = accounts[1];

    await
      contract.methods
              .enter()
              .send({ from: sourceAccount, value: web3.utils.toWei('0.1', 'ether') });
    const entries = await contract.methods.getEntries().call({ from: sourceAccount });

    assert.equal(sourceAccount, entries[0]);
    assert.equal(1, entries.length);
  });

  it('allows multiple accounts to enter', async() => {
    await
      contract.methods
              .enter()
              .send({ from: accounts[1], value: web3.utils.toWei('0.1', 'ether') });
    await
      contract.methods
              .enter()
              .send({ from: accounts[2], value: web3.utils.toWei('0.1', 'ether') });
    await
      contract.methods
              .enter()
              .send({ from: accounts[3], value: web3.utils.toWei('0.1', 'ether') });

    const entries = await contract.methods.getEntries().call({ from: accounts[0] });

    assert.equal(3, entries.length);
    assert.equal(accounts[1], entries[0]);
    assert.equal(accounts[2], entries[1]);
    assert.equal(accounts[3], entries[2]);
  });

  it('requires a minimum amount of ether to enter', async() => {
    let error = null;
    try {
      await contract.methods.enter().send({
        from: accounts[0],
        // Not enough eth should result in exception
        value: web3.utils.toWei('0.01', 'ether')
      });
    } catch (err) {
      error = err;
    }

    assert(error !== null);
  });

  it('requires manager to pick Winner', async() => {
    // Account is not the manager
    const account = accounts[3];
    let error = null;
    try {
      await contract.methods.pickWinner().send({ from: account });
    } catch (err) {
      error = err;
    }

    assert(error !== null);
  });
});
