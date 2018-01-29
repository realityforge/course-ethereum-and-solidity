import React, {Component} from 'react';
import {Card} from 'semantic-ui-react';
import web3 from 'web3';
import Layout from '../../components/Layout';
import createCampaignContract from '../../ethereum/campaign';

class CampaignShow extends React.Component {
  //The props object passed in is separate from the one passed into the component
  // The props contains props from next - in particular the parameters for route/query. See
  // https://github.com/zeit/next.js/#fetching-data-and-component-lifecycle It is also limited to the top-level "pages"
  // components only.
  static async getInitialProps(props) {
    const campaign = createCampaignContract(props.query.address);

    const summary = await campaign.methods.getSummary().call();

    // summary is actually an object ... that has numbers as keys.
    // We exapand it to more reasonable keys through the returning this value
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4]
    };
  }

  renderMetrics() {
    const {
      address,
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager
    } = this.props;
    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager created this campaign and can create requests',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this much wei to become a contributor'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description: 'A request tries to withdraw money from the contract. Requests must be approved by contributors'
      },
      {
        header: approversCount,
        meta: 'Number of Contributors',
        description: 'Number of people who have already donated to this campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'The balance is how much money this campaign has left to spend.'
      }
    ];

    return <Card.Group items={items}/>;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Details</h3>
        {this.renderMetrics()}
      </Layout>
    );
  }
}

export default CampaignShow;
