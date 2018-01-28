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
        {/* button floated to right and first so end up with two-column style layout */}
        <Button content="Create Campaign" icon="add circle" primary floated="right"/>
        {this.renderCampaigns()}
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
