import React, {Component} from 'react';
import Layout from '../../components/Layout';
import createCampaignContract from '../../ethereum/campaign';

class CampaignShow extends React.Component {
  //The props object passed in is separate from the one passed into the component
  // The props contains props from next - in particular the parameters for route/query. See https://github.com/zeit/next.js/#fetching-data-and-component-lifecycle
  // It is also limited to the top-level "pages" components only.
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

  render() {
    return (
      <Layout>
        <h3>Campaign Details</h3>
      </Layout>
    );
  }
}

export default CampaignShow;
