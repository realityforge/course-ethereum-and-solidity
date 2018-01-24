pragma solidity ^0.4.17;

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
  }

  Request[] public requests;
  // Who set up campign
  address public manager;
  // Minimum amount to have a say in campaign
  uint public minimumContribution;
  // Use a mapping for approvers so can use constant time access methods
  mapping(address => bool) public approvers;

  function Campaign(uint minimum) public {
    // documentation url: http://solidity.readthedocs.io/en/develop/units-and-global-variables.html#block-and-transaction-properties
    manager = msg.sender;
    minimumContribution = minimum;
  }

  function contribute() public payable {
    // to be an approver then need to send at least the minimumContribution
    require(msg.value > minimumContribution);
    // Add contributor to list of approvers
    approvers[msg.sender] = true;
  }

  function createRequest(string description, uint value, address recipient) public restrictedToManager {
    Request memory newRequest = Request({
      description : description,
      value : value,
      recipient : recipient,
      complete : false
      });

    // Note this is equivalent to above - just a different syntax using positional args
    //Request memory newRequest = Request(description, value, recipient, false);

    requests.push(newRequest);
  }

  // Modifiers can be used to modify functions
  modifier restrictedToManager() {
    // Restrict the invocation of this to the manager
    require(msg.sender == manager);
    // This next line tells solitidity where to invoke original function
    _;
  }
}
