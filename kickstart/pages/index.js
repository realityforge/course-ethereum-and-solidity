import React, {Component} from 'react';
import {Button, Card} from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';

class CampaignIndex extends React.Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getCampaigns().call();
    return { campaigns };
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>

        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
        {this.renderCampaigns()}

        <Button content="Create Campaign" icon="add circle" primary/>
      </Layout>
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
