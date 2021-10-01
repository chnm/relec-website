import * as d3 from 'd3';
import DenominationsMap from './cities-map';

// Load the data
const urls = [
  'http://localhost:8090/relcensus/denominations',
  'http://localhost:8090/relcensus/city-total-membership?year=1926',
  'http://localhost:8090/relcensus/city-membership?year=1926&denomination=Protestant+Episcopal+Church',
  'https://data.chnm.org/ne/northamerica/',
  'https://data.chnm.org/ahcb/states/1926-07-04/',
];
const promises = [];
urls.forEach((url) => promises.push(d3.json(url)));

// Once all the data is loaded, initialize and render the visualizations
Promise.all(promises)
  .then((data) => {
    const citiesMap = new DenominationsMap(
      '#chrono-map',
      {
        denominations: data[0],
        cityMembership: data[1],
        denominationFilter: data[2],
        northamerica: data[3],
        states: data[4],
      },
      { width: 1000, height: 525 },
    );
    citiesMap.render();

    // Listen for changes to the filter options and return them to update() and re-render the map.
    d3.selectAll('.filterSelection').on('change', async () => {
      let year = d3.select('#year-dropdown option:checked').text();
      const denomination = d3.select('#denomination-dropdown option:checked').text();

      // Convert year from string to number
      year = parseInt(year, 10);

      citiesMap.update(year, denomination);
    });
  })
  .catch((e) => {
    console.error(`There has been a problem with your fetch operation: ${e.message}`);
  });
