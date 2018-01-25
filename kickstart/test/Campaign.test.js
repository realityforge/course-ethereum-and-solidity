const assert = require('assert');
const ganache = require('ganache-cli');

//Web3 module returns a constructor function.
// We then use the constructor to create instance and connect it to specific networks
const Web3 = require('web3');

const provider = ganache.provider();

// And here's that instance
const web3 = new Web3(provider);

// Get compiled output of contracts
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async() => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // select an account to deploy from. Rather arbitrarily chose first
  const account = accounts[0];

  // deploy the contract
  factory = await
    // Parse ABI and load into local contract
    new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    // Tells web3 to create a message that deploys a new contract instance
    .deploy({ data: compiledFactory.bytecode })
    // Tells web3 to send out transaction containing the message  defined above
    .send({ from: account, gas: '1000000' });

  factory.setProvider(provider);

  // Actually call the create campaign method
  await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000' });

  // Retrieve the address of campaign object just created
  [campaignAddress] = await factory.methods.getCampaigns().call();

  // Create a local proxy from address
  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('CampaignFactory', () => {
  it('deploys the factory', () => {
    // non-null address means the contract successfully
    // deployed. Lots of other fields on inbox that contain
    // other useful details.
    assert.ok(factory.options.address);
  });
});

describe('Campaign', () => {
  it('deploys the contract', () => {
    // non-null address means the contract successfully
    // deployed. Lots of other fields on inbox that contain
    // other useful details.
    assert.ok(campaign.options.address);
  });
});
