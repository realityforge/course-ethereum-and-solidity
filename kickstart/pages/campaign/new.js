import React, {Component} from 'react';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import Layout from '../../components/Layout';

class CampaignNew extends React.Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event => this.setState({ minimumContribution: event.target.value })}/>
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage}/>
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
