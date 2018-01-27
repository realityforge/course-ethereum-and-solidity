import React, {Component} from 'react';
import {Card} from 'semantic-ui-react';
import factory from '../ethereum/factory';

class CampaignIndex extends React.Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getCampaigns().call();
    return { campaigns };
  }

  render() {
    return (
      <div>
        {this.renderCampaigns()}
      </div>
    );
  }

  renderCampaigns() {
    // Create a set of objects where each object represents a single card
    // Basically copied out semantic-ui docs
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true
      };
    });

    return <Card.Group items={items}/>;
  }
}

export default CampaignIndex;
