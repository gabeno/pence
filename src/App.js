import React, { Component } from "react";
import _ from 'lodash';

import LineChart from "./components/LineChart";
import DataStream from "./data/stream";
import { unpack } from "./data/utils";

const CHANNEL = [
  '5~CCCAGG~BTC~USD'
];

class App extends Component {
  constructor(props) {
    super(props);

    // intantiate data source
    this.stream = new DataStream({
      channels: CHANNEL
    }).getSocket();

    this.state = {
      isLoading: false,
      scrollData: _.range(n).map(() => ({
        price: 0,
        lastUpdate: Date.now()
      }))
    };

    // bind helper methods
    this.addData = this.addData.bind(this);
    this.removeData = this.removeData.bind(this);
  }

  addData(data) {
    this.setState(prevState => {
      scrollData: prevState.scrollData.push(data)
    });
  }

  removeData() {
    this.setState(prevState => {
      prevState.scrollData.shift()
      scrollData: prevState
    })
  }

  componentDidMount() {
    // data stream
    const drawPath = (message) => {
      const data = unpack(message);

      if (data) {
        console.log(data);
        // console.log(path)
        this.addData(data);
        console.log(this.state.scrollData);

        // draw here too ?

        this.removeData();
        console.log(this.state.scrollData);
      }
    }

    this.stream.on('m', drawPath);
  }

  componentWillUnmount() {
    this.stream.unsubscribe(CHANNEL);
  }

  render() {
    const { data, isLoading } = this.state;

    <div className="App">
      <h1>Bitcoin - USD price watch</h1>

      <LineChart data={this.state.data} />
      
      <p>
        Price data from <a href="https://www.cryptocompare.com/api/">CryptoCompare</a>.
      </p>
    </div>
  };
};

export default App;
