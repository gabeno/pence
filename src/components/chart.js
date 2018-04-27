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

    this.state = {
      scrollData: d3.range(10).map(() => ({
        price: 0,
        lastUpdate: Date.now() }))
    };

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
    const faux = this.props.connectFauxDOM("div", "chart");
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const duration = 1000;
    const now = Date.now();
    const n = 10;
    const HR_MS = 1*60*60*1000; // chose a more fine grained accuracy?
    const CEIL_BTC_PRICE = 2000;
    const MIN_BTC_PRICE = 0;

    const xScale = d3
      .scaleTime()
      .domain([now - HR_MS, now]) // an hour step
      .range([0, width]);

    // console.log(xScale(1524726494000));

    const yScale = d3
      .scaleLinear()
      .domain([MIN_BTC_PRICE, CEIL_BTC_PRICE]) // price yet to hit $2000
      .range([height, 0]);

    // const parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

    const line = d3
      .line()
      .x(function(d) {
        return xScale(now);
      })
      .y(function(d) {
        return yScale(1000);
      })
      .curve(d3.curveBasis);

    const svg = d3
      .select(faux)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    // add y axis
    const yAxis = svg
      .append('g')
        .attr('class', 'y axis')
      .call(d3.axisLeft(yScale));

    const path = svg
      .append('g')
        .attr('clip-path', 'url(#clip)')
      .append('path')
      .datum(this.state.scrollData)
        .attr('class', 'line')

    const transition = d3
      .transition()
      .duration(duration)
      .ease(d3.easeLinear);

    const drawPath = (message) => { // this bound to the class
      const data = unpack(message);

      if (data) {
        console.log(data);
        // console.log(path)
        this.addData(data);
        console.log(this.state.scrollData);

        /*
        yScale.domain([0, d3.max(this.state.scrollData)]);

        svg
          .select('.line')
          .attr('d', line)
          .attr('transform', null);

        path
          .transition()
			    .duration(500)
			    .ease(d3.easeLinear)
          .attr("transform", "translate(" + xScale(now - (n - 1) * duration) + ")");
        */
          
        this.removeData();
        console.log(this.state.scrollData);
      }
    }

    this.stream.on('m', drawPath);

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
