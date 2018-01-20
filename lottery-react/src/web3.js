import Web3 from 'web3';

// Copy provider from metamask which uses a historic version of web3 and use
// it to initialize our version of web3
const web3 = new Web3(window.web3.currentProvider);

export default web3;
