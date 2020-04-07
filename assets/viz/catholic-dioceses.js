import * as d3 from "/js/d3.js";

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

  constructor(id, data, margin) {
    this.data = data
    this.margin = margin

    // Select the SVG, figure out the correct height, and use the
    // viewBox property to make it scale responsively.
    this.svg = d3.select(id)
    this.aspect = 1.618034
    this.width = this.svg.node().clientWidth
    this.height = this.width / this.aspect
    this.svg
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
    this.viz = this.svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
  }

}

class DiocesesMap extends Visualization {
  constructor(id, data) {
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }
    super(id, data, margin)
    this.year = d3.select("#year").node().valueAsNumber
    this.projection = d3.geoAlbers()
      .translate([this.width / 2, this.height / 2 + 25])
      .scale(430);
    this.path = d3.geoPath().projection(this.projection);
  }

  render() {
    // Label for the year
    this.label = this.viz
      .append("text")
      .text(this.year)
      .attr("y", 24)
      .attr("font-size", 48)
      .attr("alignment-baseline", "top")

    this.viz
      .selectAll("path")
      .data(this.data.northamerica.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .attr("class", "country")

    // Draw the stuff that gets updated
    this.update(this.year)

  }

  update(year) {
    this.year = year
    this.label.text(this.year)

    let data = this.currentDioceses()

    this.viz
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => this.projection([d.lon, d.lat])[0])
      .attr("cy", d => this.projection([d.lon, d.lat])[1])
      .attr("r", "3px")
      .attr("class", function (d) {
        if (d.date_metropolitan !== "" && getYear(d.date_metropolitan) <= this.year) {
          return "metropolitan";
        } else {
          return "diocese";
        }
      })

    this.viz
      .selectAll("circle")
      .data(data)
      .exit()
      .remove()

  }

  currentDioceses() {
    return this.data.dioceses.filter(d => getYear(d.date_erected) <= this.year)
  }

}

class DiocesesBarChart extends Visualization {

  constructor(id, data) {
    const margin = { top: 20, right: 40, bottom: 40, left: 20 }
    super(id, data, margin)
    this.year = d3.select("#year").node().valueAsNumber
    this.xScale = d3.scaleBand()
      .domain(d3.range(this.data.diocesesByDecade.length))
      .range([this.margin.left, this.width - this.margin.right])
      .padding(0.1)
    this.xAxis = d3.axisBottom()
      .scale(this.xScale)
      .tickValues(this.xScale.domain().filter((d, i) => !((i + 1) % 10)))
      .tickFormat(i => this.data.diocesesByDecade[i].decade)
    this.yScale = d3.scaleLinear(
      [0, d3.max(this.data.diocesesByDecade, d => d.count)],
      [this.height - this.margin.bottom - this.margin.top, 0])
    this.yAxis = d3.axisRight()
      .scale(this.yScale)
      .ticks(10);
  }

  render() {
    this.viz
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${this.height - this.margin.bottom - this.margin.top})`)
      .call(this.xAxis)
    this.viz
      .append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${this.width - this.margin.right},0)`)
      .call(this.yAxis)

    this.viz
      .selectAll("rect")
      .data(this.data.diocesesByDecade)
      .enter()
      .append("rect")
      .attr("x", (d, i) => this.xScale(i))
      .attr("y", d => this.yScale(d.count))
      .attr("width", this.xScale.bandwidth())
      .attr("height", d => this.yScale(0) - this.yScale(d.count))

    // Draw the stuff that gets updated
    this.update(this.year)
  }

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
const urls = [
  "/visualizations/catholic-dioceses/catholic-dioceses.json",
  "/visualizations/catholic-dioceses/dioceses-by-decade.json",
  "/visualizations/catholic-dioceses/north-america.json"
]
let promises = []
urls.forEach(url => promises.push(d3.json(url)))

// Once all the data is loaded, initialize and render the visualizations
Promise.all(promises)
  .then(function (data) {
    const mapData = { dioceses: data[0], northamerica: data[2] }
    const map = new DiocesesMap("#map", mapData)
    const chartData = { diocesesByDecade: data[1] }
    const chart = new DiocesesBarChart("#barchart", chartData)
    map.render()
    chart.render()

    // Listen for changes to the slider
    d3.select("#year").on("input", function () {
      const year = this.valueAsNumber
      map.update(year);
      chart.update(year)
    });

  });
