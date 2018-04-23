import React, { Component } from "react";
import socketIO from "socket.io-client";
import { withFauxDOM } from "react-faux-dom";
import * as d3 from "d3";
import DataStream from "../data/stream";
import { unpack } from "../data/utils";

import './Chart.css';

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
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    let now = Date.now();
    const duration = 1000;
    const n = 1000;

    const svg = d3
      .select(faux)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain([now - n * duration, now - duration])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 2000])
      .range([height, 0]);

    // const parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

    const line = d3
      .line()
      .x(function(d) {
        return xScale(d.lastUpdate);
      })
      .y(function(d) {
        return yScale(d.price);
      })
      .curve(d3.curveBasis);

    svg
      .append('defs')
      .append('clipPath')
        .attr('id', 'clip')
      .append('rect')
        .attr('width', width)
        .attr('height', height);

    // add x axis
    const xAxis = svg
      .append('g')
        .attr('class', 'xaxis')
        .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    // add y axis
    const yAxis = svg
      .append('g')
      .attr('class', 'yaxis')
      .call(d3.axisLeft(yScale));

    const path = svg
      .append('g')
        .attr('clip-path', 'url(#clip)')
      .append('path')
      .datum(1500)
        .attr('class', 'line')

    const transition = d3
      .transition()
      .duration(duration)
      .ease(d3.easeLinear);

    this.stream.on("m", message => {
      const data = unpack(message);
      if (data) console.log(data);

      // update the domains
      now = new Date();
      xScale.domain([now - n * duration, now - duration]);
      yScale.domain([0, data.price]);

      d3.select('xaxis').transition(transition).call(d3.axisBottom(xScale));
    });

    // this.props.animateFauxDOM(800);
  }

  componentWillUnmount() {
    this.stream.unsubscribe(this.state.subscribe);
  }

  render() {
    return <div>{this.props.chart}</div>;
  }
}

export default withFauxDOM(Chart);
