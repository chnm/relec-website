import * as d3 from "d3";
import * as params from "@params";
import data from "./arw.json";

console.log(data);

const radius = d3.scaleSqrt([0, d3.max(data, (d) => d.organizations)], [0, 40]);

const svg = d3.select(`#${params.id}`).append("svg").attr("viewBox", [0, 0, 975, 610]);

const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300]);
const path = d3.geoPath().projection(projection);

const drawMap = (us, data) => {
  console.log(us);
  console.log(data);
  svg
    .selectAll("path")
    .data(us.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "lightgray")
    .style("stroke-width", "1")
    .style("fill", "white");

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return projection([d.long, d.lat])[0];
    })
    .attr("cy", function (d) {
      return projection([d.long, d.lat])[1];
    })
    .attr("r", (d) => radius(d.organizations))
    .style("fill", "rgb(217,91,67)")
    .style("opacity", 0.85);
};

d3.json("https://data.chnm.org/ahcb/states/1926-07-04/")
  .then((us) => drawMap(us, data))
  .catch((e) => console.log(e));

// svg.append("path")
//     .datum(topojson.feature(us, us.objects.nation))
//     .attr("fill", "#ddd")
//     .attr("d", path);

// svg.append("path")
//     .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
//     .attr("fill", "none")
//     .attr("stroke", "white")
//     .attr("stroke-linejoin", "round")
//     .attr("d", path);

// const legend = svg
//   .append("g")
//   .attr("fill", "#777")
//   .attr("transform", "translate(915,608)")
//   .attr("text-anchor", "middle")
//   .style("font", "10px sans-serif")
//   .selectAll("g")
//   .data(radius.ticks(4).slice(1))
//   .join("g");

// legend
//   .append("circle")
//   .attr("fill", "none")
//   .attr("stroke", "#ccc")
//   .attr("cy", (d) => -radius(d))
//   .attr("r", radius);

// legend
//   .append("text")
//   .attr("y", (d) => -2 * radius(d))
//   .attr("dy", "1.3em")
//   .text(radius.tickFormat(4, "s"));

// svg
//   .append("g")
//   .attr("fill", "brown")
//   .attr("fill-opacity", 0.5)
//   .attr("stroke", "#fff")
//   .attr("stroke-width", 0.5)
//   .selectAll("circle")
//   .data(data.filter((d) => d.position).sort((a, b) => d3.descending(a.organizations, b.organizations)))
//   .join("circle")
//   .attr("transform", (d) => `translate(${d.position})`)
//   .attr("r", (d) => radius(d.organizations))
//   .append("title")
//   .text(
//     (d) => `${d.title}
// ${format(d.organizations)}`
//   );
