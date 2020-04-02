import * as d3 from "/js/d3.js";

function getYear(dateString) {
  const [year, month, day] = dateString.split("-");
  return parseInt(year, 10);
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
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }
    super(id, data, margin)
  }

  render() {
    this.svg.append("text").attr("x", 10).attr("y", 30).text("Chart")
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
      map.update(this.valueAsNumber);
      // TODO chart.update()
    });

  });


