import * as d3 from "d3";

export default class ARWMap {
  constructor(id, data, us) {
    this.id = id;
    this.data = data;
    this.us = us;
    this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    };
    this.width = 975;
    this.height = 610;
    this.svg = d3.select(`#${this.id}`).append("svg").attr("viewBox", [0, 0, this.width, this.height]);
    this.radius = d3.scaleSqrt([0, d3.max(this.data, (d) => d.organizations)], [0, 30]);
    this.projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
    this.path = d3.geoPath().projection(this.projection);
  }

  draw() {
    this.svg
      .selectAll("path")
      .data(this.us.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .style("stroke", "lightgray")
      .style("stroke-width", "1")
      .style("fill", "white");

    this.svg
      .selectAll("circle")
      // .data(this.data)
      .data(this.data.sort((a, b) => d3.descending(a.organizations, b.organizations)))
      .enter()
      .append("circle")
      .attr("cx", (d) => this.projection([d.long, d.lat])[0])
      .attr("cy", (d) => this.projection([d.long, d.lat])[1])
      .attr("r", (d) => this.radius(d.organizations))
      .style("fill", "rgba(217,91,67, 0.15)")
      .style("stroke", "rgba(217,91,67, 1)")
      .append("title")
      .text((d) => `${d.city}, ${d.state}: ${d.organizations} organization(s).`);
  }
}
