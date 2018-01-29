import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import createCampaignContract from '../../../ethereum/campaign';
import {Link} from '../../../routes';

export default class RequestsIndex extends Component {
  //The props object passed in is separate from the one passed into the component
  // The props contains props from next - in particular the parameters for route/query. See
  // https://github.com/zeit/next.js/#fetching-data-and-component-lifecycle It is also limited to the top-level "pages"
  // components only.
  static async getInitialProps(props) {
    const address = props.query.address;
    const campaign = createCampaignContract(address);

    const approversCount = await campaign.methods.approversCount().call();
    const requestCount = await campaign.methods.getRequestCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
    );

    return { address, requests, requestCount, approversCount };
  }

  render() {
    console.log('this.props.address', this.props.address);
    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaign/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
          </a>
        </Link>
      </Layout>
    );
  }
}

