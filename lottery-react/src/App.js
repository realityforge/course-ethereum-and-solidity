import React, {Component} from 'react';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {
  state = { manager: '', entries: [], balance: '' };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const entries = await lottery.methods.getEntries().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, entries, balance });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are
          currently {this.state.entries.length} people entered, competing
          to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
      </div>
    );
  }
}

export default App;
