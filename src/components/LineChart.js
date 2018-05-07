import React, { Component } from "react";
// import { withFauxDOM } from "react-faux-dom";
import * as d3 from "d3";

import './Chart.css';

const margin = { top: 20, right: 20, bottom: 20, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

class Chart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const faux = this.props.connectFauxDOM("div", "chart");
    const duration = 1000;
    const now = Date.now();
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


    // this.props.animateFauxDOM(800);
  }

  render() {
    return <div>{this.props.chart}</div>;
  }
}

export default withFauxDOM(Chart);
