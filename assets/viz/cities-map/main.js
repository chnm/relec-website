import * as d3 from 'd3';
import DenominationsMap from './cities-map';

// Load the data
const urls = [
  'http://localhost:8090/relcensus/denomination-families',
  'http://localhost:8090/relcensus/denominations',
  'http://localhost:8090/relcensus/city-total-membership?year=1926',
  'https://data.chnm.org/ne/northamerica/'
];
const promises = [];
urls.forEach((url) => promises.push(d3.json(url)));

// Once all the data is loaded, initialize and render the visualizations
Promise.all(promises)
  .then((data) => {
    const citiesMap = new DenominationsMap(
      '#chrono-map',
      {
        denominationFamilies: data[0],
        denominations: data[1],
        cityMembership: data[2],
        northamerica: data[3]
      },
      { width: 1000, height: 525 },
    );
    citiesMap.render();

    // Listen for changes to the filter options and return them to update() and re-render the map.
    d3.select('#year').on('change', () => {
      let year = d3.select('#year option:checked').text();
      const state = d3.select('#state-dropdown option:checked').text();
      const denomination = d3.select('#denomination-dropdown option:checked').text();

      // Convert year from string to number
      year = parseInt(year, 10);

      citiesMap.update(year, denomination, state);
    });
  });
