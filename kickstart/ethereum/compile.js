const path = require('path');
const solc = require('solc');
// Community managed fs substitute with extra functionality
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');

// Delete the build folder
fs.removeSync(buildPath);

// Compile the source file
const sourcePath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(sourcePath, 'utf8');
const output = solc.compile(source, 1).contracts;

// Ensure build folder exists
fs.ensureDirSync(buildPath);

// write out separate json for each contract in source file
for (let contract in output) {
  const filename = path.resolve(buildPath, contract.replace(':', '') + '.json');
  const contractData = output[contract];
  fs.outputJsonSync(filename, contractData);
}
