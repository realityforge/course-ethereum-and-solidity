import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// On rinkeby network, this was the address that we deployed to.
const contractAddress = '0xcCD03E7008b4e5B39627B12C0574F022AF3e2c31';

// Create proxy wrapper
export default new web3.eth.Contract(JSON.parse(CampaignFactory.interface), contractAddress);
