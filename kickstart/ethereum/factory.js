import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// On rinkeby network, this was the address that we deployed to.
const contractAddress = '0x17BaEbCf5213040cb4645242C6f95b3230055224';

// Create proxy wrapper
export default new web3.eth.Contract(JSON.parse(CampaignFactory.interface), contractAddress);
