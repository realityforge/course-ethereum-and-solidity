import React, {Component} from 'react';
import {Button, Table} from 'semantic-ui-react';
import createCampaignContract from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from '../routes';

export default class RequestRow extends Component {

  state = {
    approveErrorMessage: '',
    approveLoading: false,
    finalizeErrorMessage: '',
    finalizeLoading: false
  };

  onApproveClick = async event => {
    event.preventDefault();

    // Update the UI to reflect that loading is occuring
    this.setState({ approveLoading: true, approveErrorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();

      const address = this.props.address;
      const campaign = createCampaignContract(address);

      const contributor = accounts[0];

      // Create the request in eth network
      await campaign.methods.approveRequest(this.props.id).send({ from: contributor, gas: '1000000' });

      // Reload routes list page
      Router.replaceRoute(`/campaign/${this.props.address}/requests`);

    } catch (err) {
      console.log('Error approving request', err);
      // Some error occurred so report it
      this.setState({ approveErrorMessage: err.message });
    }

    // Interacting with the network is complete
    this.setState({ approveLoading: false });
  };

  onFinalizeClick = async event => {
    event.preventDefault();

    // Update the UI to reflect that loading is occuring
    this.setState({ finalizeLoading: true, finalizeErrorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();

      const address = this.props.address;
      const campaign = createCampaignContract(address);

      const contributor = accounts[0];

      console.log('finalizeRequest contributor=', contributor);

      // Create the request in eth network
      await campaign.methods.finalizeRequest(this.props.id).send({ from: contributor, gas: '1000000' });

      // Reload routes list page
      Router.replaceRoute(`/campaign/${this.props.address}/requests`);

    } catch (err) {
      console.log('Error approving request', err);
      // Some error occurred so report it
      this.setState({ finalizeErrorMessage: err.message });
    }

    // Interacting with the network is complete
    this.setState({ finalizeLoading: false });

  };

  render() {
    const { Row, Cell } = Table;
    const { description, value, recipient, approvalCount, complete } = this.props.request;
    const readyToFinalize = approvalCount < (this.props.approversCount / 2);

    return (
      <Row disabled={complete} positive={readyToFinalize && !complete}>
        <Cell>{this.props.id}</Cell>
        <Cell>{description}</Cell>
        <Cell>{web3.utils.fromWei(value, 'ether')}</Cell>
        <Cell>{recipient}</Cell>
        <Cell>{approvalCount} / {this.props.approversCount}</Cell>
        <Cell>
          {complete ? null : (
            <Button primary loading={this.state.approveLoading} onClick={this.onApproveClick}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {complete ? null : (
            <Button
              loading={this.state.finalizeLoading}
              disabled={readyToFinalize}
              onClick={this.onFinalizeClick}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}
