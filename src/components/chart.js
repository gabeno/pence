import React, { Component } from "react";
import socketIO from "socket.io-client";
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';
import DataStream from "../data/stream";
import unpack from "../data/utils";

// Data source
const stream = new DataStream({ client: socketIO });
stream.subscribe("5~CCCAGG~BTC~USD");
setTimeout(() => {
  stream.unsubscribe("5~CCCAGG~BTC~USD");
}, 10000);
stream.getSocket().on("m", message => {
  const msg = unpack(message);
  if (msg) console.log(msg);
});

class Chart extends Component {
  static defaultProps = {
    chart: 'Loading ...'
  }

  componentDidMount() {
    const faux = this.props.connectFauxDOM('div', 'chart');
    d3.select(faux)
      .append('div')
      .html('Hello D3!');
    this.props.animateFauxDOM(800)
  }

  render() {
    return (
      <div>{this.props.chart}</div>
    )
  }
}

export default withFauxDOM(Chart);