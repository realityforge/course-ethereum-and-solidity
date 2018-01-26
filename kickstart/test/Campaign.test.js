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
let campaignManager;

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

  campaignManager = accounts[1];

  // Actually call the create campaign method
  await factory.methods.createCampaign('100').send({ from: campaignManager, gas: '1000000' });

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

  it('returns campaigns created', async() => {
    const sourceAccount = accounts[1];

    const campaigns = await factory.methods.getCampaigns().call({ from: sourceAccount });
    assert.equal(1, campaigns.length);
    assert.equal(campaignAddress, campaigns[0]);

    // Create a new campaign so that we can see leng increment
    await factory.methods
                 .createCampaign('1000')
                 .send({ from: sourceAccount, gas: '1000000' });

    const campaigns2 = await factory.methods.getCampaigns().call();

    assert.equal(2, campaigns2.length);
    assert.equal(campaignAddress, campaigns[0]);
  });

});

describe('Campaign', () => {
  it('deploys the contract', () => {
    // non-null address means the contract successfully
    // deployed. Lots of other fields on inbox that contain
    // other useful details.
    assert.ok(campaign.options.address);
  });

  it('has the correct campaign manager', async() => {
    const manager = await campaign.methods.manager().call();
    assert.equal(campaignManager, manager);
  });

  it('allows contributors to contribute and adds them as an approver', async() => {
    const account = accounts[3];

    const initialBalance = await web3.eth.getBalance(campaign.options.address);
    assert.equal(0, initialBalance);

    await campaign.methods.contribute().send({ from: account, value: 200 });

    // Make sure contributor was registered
    const isContributor = await campaign.methods.approvers(account).call();
    assert(isContributor);

    // Make sure the value is added to balance on the campaign account
    const balance = await web3.eth.getBalance(campaign.options.address);

    assert.ok(balance > 0);
    assert.equal(200, balance);
  });

  it('raises error if minimum contribution is too low', async() => {
    const account = accounts[3];

    const initialBalance = await web3.eth.getBalance(campaign.options.address);
    assert.equal(0, initialBalance);

    let error = null;
    try { await campaign.methods.contribute().send({ from: account, value: 99 });} catch (e) { error = e; }
    assert(error !== null);
    const isContributor = await campaign.methods.approvers(account).call();
    assert(!isContributor);

    const balance = await web3.eth.getBalance(campaign.options.address);
    assert.equal(0, balance);
  });

  it('allows a manager to make a payment request', async() => {
    const recipientAddress = accounts[3];
    await campaign.methods
                  .createRequest('Activity 1', '1000', recipientAddress)
                  .send({ from: campaignManager, gas: '1000000' });

    const request = await campaign.methods.requests(0).call();

    assert.equal('Activity 1', request.description);
    assert.equal('1000', request.value);
    assert.equal(recipientAddress, request.recipient);
    assert.equal(false, request.complete);
    assert.equal(0, request.approvalCount);
  });

  it('processes requests', async() => {

    const contributor = accounts[2];
    const requestRecipient = accounts[3];

    // Make contributor actually contribute
    await campaign.methods.contribute().send({ from: contributor, value: web3.utils.toWei('10', 'ether') });

    // Let the campaign manager create a request
    await campaign.methods
                  .createRequest('A', web3.utils.toWei('5', 'ether'), requestRecipient)
                  .send({ from: campaignManager, gas: '1000000' });

    // Let contributor vote on request
    await campaign.methods.approveRequest(0).send({ from: contributor, gas: '1000000' });

    // The campaign manager now can finalize request
    await campaign.methods.finalizeRequest(0).send({ from: campaignManager, gas: '1000000' });

    // Make sure that the recipient gets the funds from request
    let balance = await web3.eth.getBalance(requestRecipient);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    // This is a rough estimate as accounts are not reset between tests so this value is approximate.
    assert(balance > 104);
  });
});
