import React, {Component} from 'react';
import factory from '../ethereum/factory';

class CampaignIndex extends React.Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getCampaigns().call();
    return { campaigns };
  }

  render() {
    return (
      <h1>campaign count - {this.props.campaigns.length}</h1>
    );
  }
}

export default CampaignIndex;
