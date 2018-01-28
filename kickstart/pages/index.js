import React, {Component} from 'react';
import {Button, Card} from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';
import {Link} from '../routes';

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
        <Link route='/campaign/new'>
          <Button content="Create Campaign" icon="add circle" primary floated="right"/>
        </Link>
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
        description: <Link route={`/campaign/${address}`}><a>View Campaign</a></Link>,
        fluid: true
      };
    });

    return <Card.Group items={items}/>;
  }
}

export default CampaignIndex;
