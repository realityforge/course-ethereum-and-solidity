import React, {Component} from 'react';
import {Button, Table} from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
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

  renderRows() {
    return this.props.requests.map((r, index) => {
     return <RequestRow key={`request-${index}`} id={index} request={r} address={this.props.address} approversCount={this.props.approversCount}/>;
    });
  };

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaign/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

