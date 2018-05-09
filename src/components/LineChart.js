import React, { Component } from "react";
// import { withFauxDOM } from "react-faux-dom";
import * as d3 from "d3";

import './Chart.css';

const margin = { top: 20, right: 20, bottom: 20, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

class LineChart extends Component {

  state = {
    price: null, // svg path for price
    lineGenerator: d3.line(),
    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top])
  };

  xAxis = d3.axisBottom().scale(this.state.xScale);
  yAxis = d3.axisLeft().scale(this.state.yScale);

  static getDerivedStateFromProps(nextProps, prevProps) {
    if (!nextProps.data) return null;
    
    const {data} = nextProps;
    const {xScale, yScale, lineGenerator} = prevProps;

    const timeDomain = d3.extent(data, d => d.lastUpdate);
    const priceDomain = d3.extent(data, d => d.price);
    xScale.domain(timeDomain);
    yScale.domain(priceDomain);

    lineGenerator.x(d => xScale(d.lastUpdate));
    lineGenerator.y(d => yScale(d.price));
    lineGenerator.curve(d3.curveBasis);

    const price = lineGenerator(data);

    return price;
  }

  componentDidUpdate() {
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {
    console.log(this.state.price);
    return (
      <svg width={width} height={height}>
        <path d={this.state.price} fill='none' stroke='red' />
        <g>
          <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`}></g>
          <g ref='yAxis' transform={`translate(${margin.left}, 0)`}></g>
        </g>
      </svg>
    );
  }
}

export default LineChart;
