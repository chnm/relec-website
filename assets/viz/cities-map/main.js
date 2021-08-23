import * as d3 from 'd3';
import DenominationsMap from './cities-map';

// Load the data
const urls = [
  'https://data.chnm.org/catholic-dioceses/', // change with new endpoint 
  'https://data.chnm.org/ne/northamerica/'
];
const promises = [];
urls.forEach((url) => promises.push(d3.json(url)));

// Once all the data is loaded, initialize and render the visualizations
Promise.all(promises)
  .then((data) => {
    const citiesMap = new DenominationsMap(
      '#chrono-map',
      { dioceses: data[0], northamerica: data[1] },
      { width: 1000, height: 525 },
    );
    citiesMap.render();

    // Listen for changes to the filter options
    d3.select('#year').on('change', () => {
      // let year = d3.select('#year option:checked').text();
      // year = parseInt(year);
      let year = d3.select('#year option:checked').text();
      year = parseInt(year, 10);
      citiesMap.update(year);
    });
  });
