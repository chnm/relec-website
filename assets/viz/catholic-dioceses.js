import * as d3 from "/js/d3.js";

class Visualization {

  constructor(id, data) {
    this.data = data

    // Select the SVG, figure out the correct height, and use the
    // viewBox property to make it scale responsively.
    this.svg = d3.select(id)
    this.aspect = 1.618034
    this.width = this.svg.node().clientWidth
    this.height = this.width / this.aspect
    this.svg
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")


    this.margin = { top: 20, right: 20, bottom: 20, left: 30 }
  }

}

class DiocesesMap extends Visualization {
  render() {
    this.svg.append("text").attr("x", 20).attr("y", 30).text("Map")
    this.svg.append("rect").attr("x", 50).attr("y", 50).attr("width", 200).attr("height", 300)
  }
}

class DiocesesBarChart extends Visualization {
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
    const mapData = { dioceses: data[0], land: data[2] }
    const map = new DiocesesMap("#map", mapData)
    const chartData = { diocesesByDecade: data[1] }
    const chart = new DiocesesBarChart("#barchart", chartData)
    map.render()
    chart.render()
  });


