import React, { Component } from "react";
import socketIO from "socket.io-client";
import { withFauxDOM } from "react-faux-dom";
import * as d3 from "d3";
import DataStream from "../data/stream";
import { unpack, transform } from "../data/utils";

class Chart extends Component {
  static defaultProps = {
    chart: "Loading ..."
  };

  constructor(props) {
    super(props);

    this.stream = new DataStream({
      client: socketIO,
      channels: "5~CCCAGG~BTC~USD"
    }).getSocket();
  }

  componentDidMount() {
    const faux = this.props.connectFauxDOM("div", "chart");
    const margin = { top: 40, right: 10, bottom: 20, left: 10 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(faux)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleTime().rangeRound([0, width]);
    const yScale = d3.scaleLinear().rangeRound([height, 0]);

    const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.000Z");
    const d = new Date(1524036939 * 1000).toISOString();
    console.log(parseTime(d));

    const line = d3
      .line()
      .x(function(d) {
        return xScale(d.lastUpdate);
      })
      .y(function(d) {
        return yScale(d.price);
      });

    this.stream.on("m", message => {
      const data = unpack(message);
      const transformedData = transform(data);
      if (data) console.log(data);
    });

    this.props.animateFauxDOM(800);
  }

  componentWillUnmount() {
    this.stream.unsubscribe(this.state.subscribe);
  }

  render() {
    return <div>{this.props.chart}</div>;
  }
}

export default withFauxDOM(Chart);
