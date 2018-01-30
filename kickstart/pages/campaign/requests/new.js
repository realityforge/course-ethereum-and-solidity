import React, {Component} from 'react';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import createCampaignContract from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Router} from '../../../routes';

export default class RequestsNew extends Component {
  static async getInitialProps(props) {
    const address = props.query.address;
    return { address };
  }

  state = {
    description: '',
    value: '',
    recipient: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    // Update the UI to reflect that loading is occuring
    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();

      const address = this.props.address;
      const campaign = createCampaignContract(address);

      // Create the request in eth network
      await campaign.methods
                    .createRequest(this.state.description, this.state.value, this.state.recipient)
                    .send({ from: accounts[0] });

      // Change back to routes list page
      Router.pushRoute(`/campaign/${this.props.address}/requests`);

    } catch (err) {

      // Some error occurred so report it
      this.setState({ errorMessage: err.message });
    }

    // Interacting with the network is complete
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create Request</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input value={this.state.description}
                   onChange={event => this.setState({ description: event.target.value })}/>
          </Form.Field>
          <Form.Field>
            <label>Value</label>
            <Input label='wei'
                   labelPosition='right'
                   value={this.state.value}
                   onChange={event => this.setState({ value: event.target.value })}/>
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input value={this.state.recipient} onChange={event => this.setState({ recipient: event.target.value })}/>
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage}/>
          <Button loading={this.state.loading} primary>
            Create Request!
          </Button>
        </Form>
      </Layout>
    );
  }
}

