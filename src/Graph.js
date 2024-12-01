import React, { Component } from "react";
import * as d3 from "d3";

class Streamgraph extends Component {

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.loadGraph(this.props.data);
    }
  }

  loadGraph(data) {
    const svg = d3.select("#streamgraph");
    svg.selectAll("*").remove(); 
    const height = 500;
    const width = 900;
    const margin = { top: 25, right: 100, bottom: 50, left: 50 };
    const ai = ["GPT4", "Gemini", "PaLM2", "Claude", "LLaMA"];
    const colorList = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"];

    const stackGen = d3.stack().keys(ai).offset(d3.stackOffsetWiggle);
    const StackedSeries = stackGen(data);

    const xScale = d3.scaleTime().domain(d3.extent(data, (d) => d.Date)).range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear().domain([d3.min(StackedSeries, (layer) => d3.min(layer, (d) => d[0]) - 30),
        d3.max(StackedSeries, (layer) => d3.max(layer, (d) => d[1]))]).range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal().domain(ai).range(colorList);
    var areaGen = d3.area().curve(d3.curveCardinal).x((d) => xScale(d.data.Date)).y0((d) => yScale(d[0])).y1((d) => yScale(d[1]));
    let prev = null; 
    const tooltip = d3.select("#tooltip");

    svg.selectAll("path").data(StackedSeries).join("path").attr("d", areaGen).attr("fill", (d, i) => colorScale(ai[i]))
      .on("mouseover", (event, layer) => {
        const key = ai[StackedSeries.indexOf(layer)];
        const ttHeight = 200;
        const ttWidth = 250;
        const monthTime = data.map((d) => ({date: d.Date, value: d[key]}));
        
        

        tooltip.style("display", "block").style("left", `${event.pageX + 20}px`).style("top", `${event.pageY + 10}px`).html("");

        const ttSvg = tooltip.selectAll("svg").data([null]).join("svg").attr("width", ttWidth).attr("height", ttHeight);

        const xScaleTt = d3.scaleBand().domain(monthTime.map((d) =>d.date.toLocaleString("default", { month: "short" })))
        .range([25, ttWidth]).padding(0.1);

        const yScaleTt = d3.scaleLinear().domain([0, d3.max(monthTime, (d) => d.value)]).range([ttHeight - 30, 10]);

        ttSvg.selectAll(".bar").data(monthTime).join("rect").attr("class", "bar")
          .attr("x", (d) => xScaleTt(d.date.toLocaleString("default", { month: "short" }))).attr("y", (d) => yScaleTt(d.value))
          .attr("width", xScaleTt.bandwidth()).attr("height", (d) => yScaleTt(0) - yScaleTt(d.value)).style("fill", prev || colorScale(key))
          .transition().duration(790).style("fill", colorScale(key));

        prev = colorScale(key);

        ttSvg.selectAll(".x-axis").data([null]).join("g").attr("class", "x-axis").attr("transform", `translate(0,${ttHeight - 30})`)
          .call(d3.axisBottom(xScaleTt).tickSizeOuter(0));

        ttSvg.selectAll(".y-axis").data([null]).join("g").attr("class", "y-axis").attr("transform", `translate(25,0)`)
          .call(d3.axisLeft(yScaleTt).ticks()).selectAll("text").style("font-size", "10px");})

      .on("mousemove", (event) => {tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY + 10}px`);})

      .on("mouseout", () => {tooltip.style("display", "none");});

    svg.selectAll(".x-axis").data([null]).join("g").attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b")));

    svg.selectAll(".legend").data(ai.slice().reverse()).join("g").attr("class", "legend").attr("transform", (d, i) => `translate(${width - 70}, ${20 + i * 25 +120})`)
      .call(g => g.selectAll("rect").data(d => [d]).join("rect").attr("x", 0).attr("y", 0).attr("width", 20)
      .attr("height", 20).attr("fill", d => colorScale(d)))
      .call(g => g.selectAll("text").data(d => [d]).join("text").attr("x", 30).attr("y", 15).text(d => d)
      .style("font-size", "12px").attr("fill", "#000"));
  }

  render() {
    return (
      <div>
        <svg id="streamgraph" width="900" height="500"></svg>
        <div id="tooltip" className="tooltip"></div>
      </div>
    );
  }
}

export default Streamgraph;