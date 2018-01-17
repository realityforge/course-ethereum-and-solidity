// The provider used by Web3 that allows using mnemonic + url to connect to actual network
const HDWalletProvider = require('truffle-hdwallet-provider');

// Web3 constructor
const Web3 = require('web3');

// Compiled output of contract
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  // This is mnemonic used when setting up account, which I sent some Eth to via website
  'engage share tuition wire noble choose example runway file replace loop blame',
  // Infura is website that makes it easy to connect to network. See infura.io for details
  // This one is bound to my account (p1UcQz0BDrRdDCymn0Pm) and rinkeby network
  'https://rinkeby.infura.io/p1UcQz0BDrRdDCymn0Pm'
);

// Create web3 instance, ready to talk to network
const web3 = new Web3(provider);
