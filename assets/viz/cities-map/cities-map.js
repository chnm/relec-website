/* eslint-disable max-len */
import * as d3 from "d3";
import Visualization from "../common/visualization";

export default class DenominationsMap extends Visualization {
  constructor(id, data, dim) {
    const margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    };

    super(id, data, dim, margin);

    // Keep track of defaults.
    this.allFamilies = "All denomination families";
    this.allDenominations = "All denominations";

    // The following handles year data, map projections, and zoom behavior.
    this.projection = d3
      .geoAlbers()
      .translate([this.width / 2 + 60, this.height / 2 + 40])
      .scale(1000);
    this.path = d3.geoPath().projection(this.projection);

    // Keep track of which element is centered
    this.centered = null;

    // Keep track of how much to scale things based on zoom
    this.kScale = 0.5;

    // The zoom function is called below in update() to handle zooming in and out on points
    // using the updated zoom(event, datum) => {...} changes in D3 v6+.
    this.zoom = (e, d) => {
      let x;
      let y;
      let k;
      if (d && this.centered !== d) {
        const coords = this.projection([d.lon, d.lat]);
        [x, y] = coords;
        k = 10;
        this.kScale = 8;
        this.centered = d;
      } else {
        x = this.width / 2 - 10;
        y = this.height / 2 - 10;
        k = 1;
        this.kScale = 1;
        this.centered = null;
      }

      this.viz
        .transition()
        .duration(500)
        .attr(
          "transform",
          `translate(${this.width / 2},${
            this.height / 2
          })scale(${k}) translate(${-x},${-y})`
        );
      this.viz
        .selectAll(".country")
        .transition()
        .duration(500)
        .style("stroke-width", `${0.5 / this.kScale}px`);
      this.viz
        .selectAll(".states")
        .transition()
        .duration(500)
        .style("stroke-width", `${0.5 / this.kScale}px`);
    };

    // The tooltip is conditional based on whether we're displaying
    // All data or a single denomination.
    this.tooltipRender = (e, d) => {
      if (
        this.denomination === this.allDenominations &&
        this.family === this.allFamilies
      ) {
        // We use JS native .toLocalString() to display thousands separator based on user's locale
        const text = `${
          `Denomination count for <strong>${d.city}, ${d.state}</strong> in <strong>${d.year}</strong><br/>` +
          `Number of denominations: ${d.denominations.toLocaleString()}<br/>` +
          `Number of churches: ${d.churches.toLocaleString()}<br/>`
        }${
          // Check to make sure population data is not null
          d.population_1926 === null
            ? "City population: Missing"
            : `City population: ${d.population_1926.toLocaleString()}<br/>`
        }`;
        this.tooltip.html(text);
        this.tooltip.style("visibility", "visible");
      } else {
        const text =
          `Denomination count for <strong>${d.city}, ${d.state}</strong> in <strong>${d.year}</strong><br/>` +
          `Denomination: ${d.group}<br/>` +
          `Number of churches: ${d.churches.toLocaleString()}<br/>` +
          `Total church membership: ${d.members.toLocaleString()}`;
        this.tooltip.html(text);
        this.tooltip.style("visibility", "visible");
      }
    };
  }

  // Draw the unchanging parts of the visualization
  render() {
    // Draw the map features
    this.viz
      .selectAll("path")
      .data(this.data.northamerica.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .attr("class", "country");

    this.viz
      .selectAll(null)
      .data(this.data.states.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .attr("class", "states");

    // Draw the tooltip
    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "dioceses-map-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    this.viz
      .append("rect")
      .attr("class", "overlay")
      .attr("width", this.width)
      .attr("height", this.height)
      .on("click", this.zoom);
  }

  // Draw the stuff that gets updated
  update(year, denomination, family, countSelection) {
    // On update, remove existing data and redraw with new data.
    this.viz.selectAll("circle:not(.legend)").remove();
    this.viz.selectAll(".legend").remove();
    this.viz.selectAll(".legend-text").remove();

    d3.select(".year-title").text(`${year}`);
    d3.select(".count-title").text(`${countSelection}`);

    // Update the radius of the points based on the countSelection
    this.viz
      .selectAll("circle:not(.legend)")
      .transition()
      .duration(500)
      .attr("r", (d) =>
        this.radius(countSelection === "Congregations" ? d.churches : d.members)
      )
      .style("stroke-width", `${0.5 / this.kScale}px`);

    // Update the denomination data by returning the Promise below
    // array to the updateFilterSelections() function.
    Promise.resolve(this.updateFilterSelections(year, denomination, family))
      .then((data) => {
        // this.radius sets the radius of the circles using d3.scaleSqrt(). The domain is set to the max
        // value of the data. The range is set to some sensible defaults. The radius needs to change
        // depending on the choices by the user. There are three options for the radius scale:
        // 1. A scale to handle the selection of All families and All denominations
        // 2. A scale to handle the selection of a single family and All denominations
        // 3. A scale to handle the selection of a single family and a single denomination
        // The values of the radius scale will change depending on the user's selection
        // of this.countSelectChoice, to either be d.members or d.churches in data from the Promise.

        // 1. A scale to handle the selection of All families and All denominations
        if (
          family === this.allFamilies &&
          denomination === this.allDenominations
        ) {
          d3.select(".denomination-title").text("all");
          if (countSelection === "Congregations") {
            this.radius = d3
              .scaleSqrt()
              .domain([0, d3.max(data, (d) => d.churches)])
              .range([0, 50]);
          } else if (countSelection === "Members") {
            this.radius = d3
              .scaleSqrt()
              .domain([0, d3.max(data, (d) => d.members)])
              .range([0, 80]);
          }
          // 2a. A scale to handle the selection of a single family and All denominations
        } else if (
          family !== this.allFamilies &&
          denomination === this.allDenominations
        ) {
          d3.select(".denomination-title").text(`${this.family}`);
          if (countSelection === "Congregations") {
            this.radius = d3
              .scaleSqrt()
              .domain([0, d3.max(data, (d) => d.churches)])
              .range([1, d3.max(data, (d) => d.churches) < 6 ? 4 : 30]);
          } else if (countSelection === "Members") {
            this.radius = d3
              .scaleSqrt()
              .domain([0, d3.max(data, (d) => d.members)])
              .range([0, 40]);
          }
          // 2b. A scale to handle the selection of all families and a single denominations
        } else if (
          family === this.allFamilies &&
          denomination !== this.allDenominations
        ) {
          d3.select(".denomination-title").text(`${this.denomination}`);
          if (countSelection === "Congregations") {
            this.radius = d3
              .scaleSqrt()
              .domain([1, d3.max(data, (d) => d.churches)])
              .range([1, d3.max(data, (d) => d.churches) < 6 ? 4 : 40]);
          } else if (countSelection === "Members") {
            this.radius = d3
              .scaleSqrt()
              .domain([0, d3.max(data, (d) => d.members)])
              .range([0, 80]);
          }
          // 3. A scale to handle the selection of a single family and a single denomination
        } else if (
          family !== this.allFamilies &&
          denomination !== this.allDenominations
        ) {
          d3.select(".denomination-title").text(`${this.denomination}`);
          if (countSelection === "Congregations") {
            this.radius = d3
              .scaleSqrt()
              .domain([0, d3.max(data, (d) => d.churches)])
              .range([1, d3.max(data, (d) => d.churches) < 6 ? 7 : 30]);
          } else if (countSelection === "Members") {
            this.radius = d3
              .scaleSqrt()
              .domain([0, d3.max(data, (d) => d.members)])
              .range([0, 40]);
          }
        }

        // Join new data from the API.
        this.viz
          .selectAll("circle:not(.legend)")
          .data(data.sort((a, b) => d3.descending(a.churches, b.churches)))
          .join(
            (enter) =>
              enter
                .append("circle")
                .attr("cx", (d) => this.projection([d.lon, d.lat])[0])
                .attr("cy", (d) => this.projection([d.lon, d.lat])[1])
                .attr("r", (d) =>
                  this.radius(
                    countSelection === "Congregations" ? d.churches : d.members
                  )
                )
                .style("stroke-width", "0.5px")
                .attr("class", "point"),
            (update) => update.attr("class", "point")
          );

        // Draw the legend, update radius based on extent of data.
        const legend = this.viz
          .append("g")
          .attr("class", "legend")
          .attr("transform", "translate(120,470)")
          .attr("text-anchor", "middle")
          .style("font", "10px sans-serif")
          .selectAll("g")
          .data(
            this.radius
              .ticks(
                // if d.churches < 6, the legend will be one circle, otherwise four circles
                d3.max(data, (d) => d.churches) < 6 ? 1 : 4
                // 3
              )
              .slice(1)
          )
          .join("g");

        legend
          .append("circle")
          .attr("fill", "none")
          .attr("stroke", "#ccc")
          .attr("cy", (d) => -this.radius(d))
          .attr("r", this.radius)
          .classed("legend", true);

        legend
          .append("text")
          .attr("y", (d) => -2.1 * this.radius(d))
          .attr("dy", "1.3em")
          .text(this.radius.tickFormat(4, "s"))
          .classed("legend-text", true)
          .text((d, i, e) =>
            i === e.length - 1 ? `${d} ${countSelection.toLowerCase()}` : d
          );

        this.viz
          .selectAll("circle:not(.legend)")
          .on("mouseover", this.tooltipRender)
          .on("mousemove", () => {
            // Show the tooltip to the right of the mouse, unless we are
            // on the rightmost 25% of the browser.
            if (event.clientX / this.width >= 0.75) {
              this.tooltip
                .style("top", `${event.pageY - 10}px`)
                .style(
                  "left",
                  `${
                    event.pageX -
                    this.tooltip.node().getBoundingClientRect().width -
                    10
                  }px`
                );
            } else {
              this.tooltip
                .style("top", `${event.pageY - 10}px`)
                .style("left", `${event.pageX + 10}px`);
            }
          })
          .on("mouseout", () => this.tooltip.style("visibility", "hidden"))
          .on("click", this.zoom);
      })
      .catch((log) => {
        console.log(log);
        // We select the viz and display error text in the event something goes wrong.
        this.viz.selectAll("circle").remove();
        this.viz.selectAll("path").remove();
        this.viz.selectAll("text").remove();
        this.viz
          .append("text")
          .attr("x", this.width / 2)
          .attr("y", this.height / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .style("fill", "#777")
          .text(
            "Sorry, there was a problem on our end with loading the data. Please try again later."
          )
          .classed("error", true);
      });
  }

  // When a user selects a year or denomination, we fetch the data from the API and
  // return a Promise that resolves to the data. We then update the visualization
  // with the new data.
  updateFilterSelections(year, denomination, family) {
    this.year = year;
    this.denomination = denomination;
    this.family = family;

    // If a user selects All, we return the cityMembership API to display the data.
    // Otherwise, we return the denominationFilter API url with the selected year and denomination.
    if (
      this.denomination === this.allDenominations &&
      this.family === this.allFamilies
    ) {
      return this.data.denominationAggregate.filter(
        (d) => d.year === this.year
      );
    }

    // If a user selects a single denomination and family as 'All',
    // we return the summed data for the selected year and denomination family.
    if (
      this.denomination === this.allDenominations &&
      this.family !== this.allFamilies
    ) {
      const url = `http://localhost:8090/relcensus/city-membership?year=${year}&denominationFamily=${family}`;
      const denomfamily = fetch(url)
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => {
          console.error(
            "There has been a problem with fetching denominations: ",
            error
          );
          console.log("Attempted url: ", url);
        });

      return denomfamily;
    }

    const url = `http://localhost:8090/relcensus/city-membership?year=${year}&denomination=${denomination}`;
    const dataResponse = fetch(url)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error(
          "There has been a problem with fetching denominations: ",
          error
        );
        console.log("Attempted url: ", url);
      });

    return dataResponse;
  }
}
