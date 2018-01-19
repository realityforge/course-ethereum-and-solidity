const path = require('path');
const fs = require('fs');
const solc = require('solc');

// Path to solidity contract source file
const inboxPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

const source = fs.readFileSync(inboxPath, 'utf8');

// Run console.log(solc.compile(source, 1)) to get output of compiler

// This returns the compiled output of Lottery contract
module.exports = solc.compile(source, 1).contracts[':Lottery'];
