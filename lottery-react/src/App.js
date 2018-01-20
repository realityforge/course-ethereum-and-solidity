import React, {Component} from 'react';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {
  state = { manager: '', entries: [], balance: '', value: '', message: '' };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const entries = await lottery.methods.getEntries().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, entries, balance });
    this.timeout = setInterval(this.reloadState, 3000);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearInterval(this.timeout);
    }
  }

  onEnter = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  reloadState = async() => {
    const entries = await lottery.methods.getEntries().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ entries, balance });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are
          currently {this.state.entries.length} people entered, competing
          to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr/>

        <form onSubmit={this.onEnter}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h1>{this.state.message}</h1>

      </div>
    );
  }
}

export default App;
