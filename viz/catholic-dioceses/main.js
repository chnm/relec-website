import * as d3 from "d3";
import './style.css';

// Take in an ISO-8601 string and return just the year as an integer
function getYear(dateString) {
  const year = dateString.split("-");
  return parseInt(year, 10);
}

// Take in a year and get back the decade.
function getDecade(year) {
  return Math.trunc(year / 10) * 10;
}

class Visualization {

  constructor(id, data, dim, margin) {
    this.data = data;
    this.margin = margin;

    // Select the SVG, figure out the correct height, and use the
    // viewBox property to make it scale responsively.
    this.svg = d3.select(id);
    this.width = dim.width;
    this.height = dim.height;
    const outerWidth = this.width + this.margin.left + this.margin.right;
    const outerHeight = this.height + this.margin.top + this.margin.bottom;
    this.svg.attr("viewBox", `0 0 ${outerWidth} ${outerHeight}`);

    // The viz is the usable part of the plot, excluding the margins
    this.viz = this.svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  }

}

class DiocesesMap extends Visualization {

  constructor(id, data, dim) {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    super(id, data, dim, margin);

    this.year = d3.select("#year").node().valueAsNumber;
    this.projection = d3.geoAlbers()
      .translate([this.width / 2 + 40, this.height / 2 + 40])
      .scale(500);
    this.path = d3.geoPath().projection(this.projection);
  }

  // Draw the unchanging parts of the visualization
  render() {
    // Label for the year
    this.label = this.viz
      .append("text")
      .text(this.year)
      .attr("y", 24)
      .attr("font-size", 48)
      .attr("alignment-baseline", "top");

    // Legend for the types of dioceses
    const legend = this.viz
      .append("g")
      .attr("transform", "translate(8,50)");
    legend.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 3)
      .attr("class", "diocese")
      .classed("legend", true);
    legend
      .append("text")
      .attr("x", 10)
      .attr("y", 5)
      .text("Diocese");
    legend
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 25)
      .attr("r", 3)
      .attr("class", "metropolitan")
      .classed("legend", true);
    legend
      .append("text")
      .attr("x", 10)
      .attr("y", 30)
      .text("Archdiocese");

    this.viz
      .selectAll("path")
      .data(this.data.northamerica.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .attr("class", "country");

    // On first render, draw the stuff that gets updated
    this.update(this.year);

  }

  // Draw the stuff that gets updated
  update(year) {
    this.year = year;
    this.label.text(this.year);

    this.viz
      .selectAll("circle:not(.legend)")
      .data(this.currentDioceses())
      .join(
        enter => enter
          .append("circle")
          .attr("cx", d => this.projection([d.lon, d.lat])[0])
          .attr("cy", d => this.projection([d.lon, d.lat])[1])
          .attr("r", "3px")
          .attr("class", d => this.dioceseType(d.date_metropolitan, year)),
        update => update
          .attr("class", d => this.dioceseType(d.date_metropolitan, year)),
        exit => exit
          .remove()
      );

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    this.viz
      .selectAll("circle")
      .on("mouseover", function (d) {
        const text =
          `Diocese of ${d.city} in ${d.state}<br/>` +
          `Founded ${getYear(d.date_erected)}`;
        tooltip.html(text);
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", function () {
        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        return tooltip.style("visibility", "hidden");
      });

  }

  // Filter the data down to the dioceses that should be displayed in a year
  currentDioceses() {
    return this.data.dioceses.filter(d => getYear(d.date_erected) <= this.year);
  }

  // Return the class for the type of diocese
  dioceseType(dateMetropolitan, year) {
    return getYear(dateMetropolitan) <= year ? "metropolitan" : "diocese";
  }

}

class DiocesesRiteMap extends Visualization {

  constructor(id, data, dim) {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    super(id, data, dim, margin);
    this.colorScale = d3.scaleOrdinal(d3.schemeSet1);
    this.projection = d3.geoAlbers()
      .translate([this.width / 2 + 40, this.height / 2])
      .scale(1000);
    this.path = d3.geoPath().projection(this.projection);
  }

  render() {
    this.viz
      .selectAll("path")
      .data(this.data.northamerica.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .attr("class", "country");

    this.viz
      .selectAll("circle:not(.legend)")
      .data(this.currentDioceses())
      .join("circle")
      .attr("cx", d => this.projection([d.lon, d.lat])[0])
      .attr("cy", d => this.projection([d.lon, d.lat])[1])
      .attr("r", 5)
      .style("fill", d => this.colorScale(d.rite))
      .classed("nonlatin", true);

    const legend = this.viz
      .append("g")
      .attr("transform", "translate(0,10)");

    const rites = this.colorScale.domain();
    for (let i = 0; i < rites.length; i++) {
      legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 25 * i)
        .attr("r", 5)
        .style("fill", this.colorScale(rites[i]))
        .classed("nonlatin", true)
        .classed("legend", true);
      legend
        .append("text")
        .attr("x", 10)
        .attr("y", 5 + 25 * i)
        .text(rites[i] + " Rite");
    }

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .text("I'm a circle!");

    this.viz
      .selectAll("circle")
      .on("mouseover", function (d) {
        const text = `Diocese of ${d.city} in ${d.state}<br/>${d.rite} Rite`;
        tooltip.html(text);
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", function () {
        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", function () {
        return tooltip.style("visibility", "hidden");
      });

  }

  currentDioceses() {
    return this.data.dioceses.filter(d => d.rite != "Latin");
  }

}

class DiocesesBarChart extends Visualization {

  constructor(id, data, dim) {
    const margin = { top: 10, right: 40, bottom: 40, left: 10 };
    super(id, data, dim, margin);
    this.year = d3.select("#year").node().valueAsNumber;
    this.xScale = d3.scaleBand()
      .domain(d3.range(this.data.diocesesByDecade.length))
      .range([0, this.width])
      .padding(0.1);
    this.xAxis = d3.axisBottom()
      .scale(this.xScale)
      .tickValues(this.xScale.domain().filter((d, i) => !((i + 1) % 5)))
      .tickFormat(i => this.data.diocesesByDecade[i].decade);
    this.yScale = d3.scaleLinear(
      [0, d3.max(this.data.diocesesByDecade, d => d.count)],
      [this.height, 0]);
    this.yAxis = d3.axisRight()
      .scale(this.yScale)
      .ticks(10);
  }

  // Draw the unchanging parts of the visualization
  render() {

    this.viz
      .append("text")
      .attr("x", 0)
      .attr("y", 30)
      .text("Dioceses erected per decade");

    this.viz
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${this.height + 1})`)
      .call(this.xAxis);

    this.viz
      .append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${this.width + 1},0)`)
      .call(this.yAxis);

    this.viz
      .selectAll("rect")
      .data(this.data.diocesesByDecade)
      .enter()
      .append("rect")
      .attr("x", (d, i) => this.xScale(i))
      .attr("y", d => this.yScale(d.count))
      .attr("width", this.xScale.bandwidth())
      .attr("height", d => this.yScale(0) - this.yScale(d.count));

    // On first render, draw the stuff that gets updated
    this.update(this.year);
  }

  // Draw the changing parts of the visualization
  update(year) {
    this.viz
      .selectAll("rect")
      .data(this.data.diocesesByDecade)
      .classed("active", false)
      .filter(d => d.decade === getDecade(year))
      .classed("active", true);
  }

}

// Begin actually loading the data and drawing the visualizations
let urls = [
  "/visualizations/catholic-dioceses/catholic-dioceses.json",
  "/visualizations/catholic-dioceses/dioceses-by-decade.json",
  "/visualizations/catholic-dioceses/north-america.json"
];
const promises = [];
urls.forEach(url => promises.push(d3.json(url)));

// Once all the data is loaded, initialize and render the visualizations
Promise.all(promises)
  .then(function (data) {

    const chronoMap = new DiocesesMap(
      "#chrono-map",
      { dioceses: data[0], northamerica: data[2] },
      { width: 1000, height: 600 }
    );
    chronoMap.render();

    const chart = new DiocesesBarChart(
      "#barchart",
      { diocesesByDecade: data[1] },
      { width: 400, height: 200 }
    );
    chart.render();

    const riteMap = new DiocesesRiteMap(
      "#rite-map",
      { dioceses: data[0], northamerica: data[2] },
      { width: 1000, height: 600 }
    );
    riteMap.render();


    // Listen for changes to the slider
    d3.select("#year").on("input", function () {
      const year = this.valueAsNumber;
      chronoMap.update(year);
      chart.update(year);
    });

  });
