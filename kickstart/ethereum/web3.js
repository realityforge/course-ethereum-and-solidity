import Web3 from 'web3';

// Initialize Web3 instanced based on provider that comes from MetaMask
let web3 = new Web3(window.web3.currentProvider);

export default web3;
