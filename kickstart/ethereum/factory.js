import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// On rinkeby network, this was the address that we deployed to.
const contractAddress = '0x9136f3898Fb944e42592D08a5e127eb37cA0e2aE';

// Create proxy wrapper
export default new web3.eth.Contract(JSON.parse(CampaignFactory.interface), contractAddress);
