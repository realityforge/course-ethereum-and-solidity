// The provider used by Web3 that allows using mnemonic + url to connect to actual network
const HDWalletProvider = require('truffle-hdwallet-provider');

// Web3 constructor
const Web3 = require('web3');

// Compiled output of contract
const { interface, bytecode } = require('./compile');
