pragma solidity ^0.4.17;

contract CampaignFactory {
  address[] private campaigns;

  function createCampaign(uint minimum) public {
    // Create a new campaign and add to list of campaigns managing
    address campaign = new Campaign(msg.sender, minimum);
    campaigns.push(campaign);
  }

  function getCampaigns() public view returns (address[]) {
    return campaigns;
  }
}

contract Campaign {
  // A request for some amount of spending on Campaign
  struct Request {
    // describe the reason for extracting the value
    string description;
    // the amount to transfer in wei
    uint value;
    // where the value gets transfered
    address recipient;
    // has the request completed?
    bool complete;
    // The number of yes votes
    uint approvalCount;
    // The addresses that have responded to request
    mapping(address => bool) responders;
  }

  Request[] public requests;
  // Who set up campaign
  address public manager;
  // Minimum amount to have a say in campaign
  uint public minimumContribution;
  // Use a mapping for approvers so can use constant time access methods
  mapping(address => bool) public approvers;
  // The number of approvers in Campaign
  uint public approversCount;

  function Campaign(address mgr, uint minimum) public {
    manager = mgr;
    minimumContribution = minimum;
  }

  // previous we returned a struct but web3.js does not seem to support this...
  function getSummary() public view returns (uint, uint, uint, uint, address) {
    address contractAddress = this;
    return (
    // Minimum amount to have a say in campaign
    minimumContribution,
    // the amount of wei in account
    contractAddress.balance,
    // the number of requests
    requests.length,
    // The number of contributors in Campaign
    approversCount,
    // Who set up campaign
    manager
    );
  }

  function getRequestCount() public view returns (uint) {
    return requests.length;
  }

  function contribute() public payable {
    // to be an approver then need to send at least the minimumContribution
    require(msg.value > minimumContribution);
    // Add contributor to list of approvers
    approvers[msg.sender] = true;

    // Manage number of approvers
    approversCount ++;
  }

  function createRequest(string description, uint value, address recipient) public restrictedToManager {
    Request memory newRequest = Request({
      description : description,
      value : value,
      recipient : recipient,
      complete : false,
      approvalCount : 0
      });

    // Note this is equivalent to above - just a different syntax using positional args
    //Request memory newRequest = Request(description, value, recipient, false);

    requests.push(newRequest);
  }

  function approveRequest(uint index) public {
    // Must be an approver
    require(approvers[msg.sender]);

    // Get request that we care about
    Request storage request = requests[index];

    // Make sure approver has not already approved request
    require(!request.responders[msg.sender]);

    // Mark approver  as having voted
    request.responders[msg.sender] = true;

    // Increment count
    request.approvalCount += 1;
  }

  function finalizeRequest(uint index) public restrictedToManager {
    // Get request that we care about
    Request storage request = requests[index];

    // Make sure request not already complete
    require(!request.complete);

    // More than 50% of the approvers must agree to request
    require(request.approvalCount > approversCount / 2);

    // Mark request as complete
    request.complete = true;

    // transfer money to recipient
    request.recipient.transfer(request.value);

    // Notes: don't check that there is enough ETH to do
    // this in approval process?
  }

  // Modifiers can be used to modify functions
  modifier restrictedToManager() {
    // Restrict the invocation of this to the manager
    require(msg.sender == manager);
    // This next line tells solitidity where to invoke original function
    _;
  }
}
