// The provider used by Web3 that allows using mnemonic + url to connect to actual network
const HDWalletProvider = require('truffle-hdwallet-provider');

// Web3 constructor
const Web3 = require('web3');

// Get compiled output of contracts
const compiledFactory = require('../ethereum/build/CampaignFactory.json');

const provider = new HDWalletProvider(
  // This is mnemonic used when setting up account, which I sent some Eth to via website
  'engage share tuition wire noble choose example runway file replace loop blame',
  // Infura is website that makes it easy to connect to network. See infura.io for details
  // This one is bound to my account (p1UcQz0BDrRdDCymn0Pm) and rinkeby network
  'https://rinkeby.infura.io/p1UcQz0BDrRdDCymn0Pm'
);

// Create web3 instance, ready to talk to network
const web3 = new Web3(provider);

// This function exists simply so we can  use async/await syntax
const deploy = async() => {
  const accounts = await web3.eth.getAccounts();

  const selectedAccount = accounts[0];

  console.log('Attempting to deploy from account', selectedAccount);

  const result = await
    new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode, arguments: [] })
    // Send creates a transaction. Contrast with call
    .send({ gas: '1000000', from: selectedAccount });

  console.log('Contract deployed to', result.options.address);
};
deploy();

// Note: This is very very similar to the test javascript
