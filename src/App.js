import React, { Component } from "react";
import _ from "lodash";

import LineChart from "./components/LineChart";
import DataStream from "./data/stream";
import { unpack } from "./data/utils";

class App extends Component {
  constructor(props) {
    super(props);

    // intantiate data source
    this.stream = new DataStream().getSocket();

    this.state = {
      isLoading: false,
      scrollData: _.range(50).map(() => ({
        price: 0,
        lastUpdate: Date.now()
      }))
    };
  }

  componentDidMount() {
    // data stream
    this.stream.on('m', message => {
      const data = unpack(message);
      // adjust the data window
      this.setState(prevState => {
        prevState.scrollData.shift();
        scrollData: prevState.scrollData.push(data);
      });
    });
  }

  componentWillUnmount() {
    this.stream.unsubscribe();
  }

  render() {
    const { scrollData } = this.state;

    return (
      <div className="App">
        <h1>Bitcoin - USD price watch</h1>
        <LineChart data={scrollData} />
        <p>
          Price data from <a href="https://www.cryptocompare.com/api/">CryptoCompare</a>.
        </p>
      </div>
    );
  }
}

export default App;
