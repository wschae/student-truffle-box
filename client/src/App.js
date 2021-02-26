import React, { Component } from "react";
import StudentContract from "./contracts/Student.json";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: null, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

    // Stores an initial value
    //instance.methods.setStudent('Tom', 'Holland', '06/01/1996').send({from: accounts[0]});

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    
    await contract.methods.set(5).send({from: accounts[0]});

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    //const response = await contract.methods.getStudent().call();
    
    // Update state with the result.
    this.setState({ 
        // storageValue: 'Enrolled ' + response[0] + ' ' + response[1] 
        //             + ' with DOB ' + response[2]
        storageValue: response
      });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Student Enrollment</h1>
        <h2 > {this.state.storageValue}
        </h2>
      </div>
    );
  }
}

export default App;
