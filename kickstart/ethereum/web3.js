import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // In a browser and Metamask is present
  web3 = new Web3(window.web3.currentProvider);
} else {
  // Not in the browser or Metamask not running. i.e. Server-side or in normal users browser
  const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/p1UcQz0BDrRdDCymn0Pm');
  web3 = new Web3(provider);
}

export default web3;
