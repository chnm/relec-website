import * as d3 from 'd3';
import DiocesesMap from './dioceses-map';
import DiocesesRiteMap from './dioceses-rite-map';
import DiocesesBarChart from './dioceses-bar-chart';

// Load the data
const urls = [
  'https://data.chnm.org/catholic-dioceses/',
  'https://data.chnm.org/catholic-dioceses/per-decade/',
  'https://data.chnm.org/ne/northamerica/',
];
const promises = [];
urls.forEach((url) => promises.push(d3.json(url)));

// Once all the data is loaded, initialize and render the visualizations
Promise.all(promises)
  .then((data) => {
    const chronoMap = new DiocesesMap(
      '#chrono-map',
      { dioceses: data[0], northamerica: data[2] },
      { width: 1000, height: 525 },
    );
    chronoMap.render();  

    const chart = new DiocesesBarChart(
      '#barchart',
      { diocesesByDecade: data[1] },
      { width: 400, height: 200 },
    );
    chart.render();

    const riteMap = new DiocesesRiteMap(
      '#rite-map',
      { dioceses: data[0], northamerica: data[2] },
      { width: 1000, height: 600 },
    );
    riteMap.render();

    // Listen for changes to the slider
    d3.select('#year').on('input', function updateViz() {
      const year = this.valueAsNumber;
      chronoMap.update(year);
      chart.update(year);
    });
  });
