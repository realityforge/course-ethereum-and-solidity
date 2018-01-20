import web3 from './web3';

const address = '0xe5DC625C20b185Fc57CbdD0F3805F57A1f132C6D';

const abi = [{
  'constant': true,
  'inputs': [],
  'name': 'getEntries',
  'outputs': [{ 'name': '', 'type': 'address[]' }],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function'
},
  {
    'constant': true,
    'inputs': [],
    'name': 'manager',
    'outputs': [{ 'name': '', 'type': 'address' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'pickWinner',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [{ 'name': '', 'type': 'uint256' }],
    'name': 'entries',
    'outputs': [{ 'name': '', 'type': 'address' }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'enter',
    'outputs': [],
    'payable': true,
    'stateMutability': 'payable',
    'type': 'function'
  },
  {
    'inputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor'
  }];

export default new web3.eth.Contract(abi, address);
