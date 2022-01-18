import * as d3 from 'd3';
import DenominationsMap from './cities-map';
import LDSMap from './lds-map';

// Load the data
const urls = [
  'https://data.chnm.org/relcensus/denominations',
  'https://data.chnm.org/relcensus/city-membership?year=1926&denomination=Protestant+Episcopal+Church',
  'https://data.chnm.org/relcensus/city-membership?year=1926',
  'https://data.chnm.org/relcensus/denomination-families',
  'https://data.chnm.org/ne/northamerica/',
  'https://data.chnm.org/ahcb/states/1926-07-04/',

  'https://data.chnm.org/relcensus/city-membership?year=1926&denomination=Church+of+Jesus+Christ+of+Latter-day+Saints',
  'https://data.chnm.org/relcensus/city-membership?year=1926&denomination=Reorganized+Church+of+Jesus+Christ+of+Latter+Day+Saints',
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
        denominationAggregate: data[2],
        denominationFamilies: data[3],
        northamerica: data[4],
        states: data[5],
      },
      { width: 1000, height: 525 },
    );
    citiesMap.render();

    const LdsMap = new LDSMap(
      '#lds-map',
      {
        lds: data[6],
        rlds: data[7],
        northamerica: data[4],
      },
      { width: 1000, height: 600 },
    );
    LdsMap.render();

    // Listen for changes to the filter options and return them to update() and re-render the map.
    d3.selectAll('.filterSelection').on('change', async () => {
      let year = d3.select('#year-dropdown option:checked').text();
      const denomination = d3.select('#denomination-dropdown option:checked').text();
      const denominationFamilySelection = d3.select('#denomination-family-dropdown option:checked').text();
      const countSelection = d3.select('#counts-dropdown option:checked').text();

      // Convert year from string to number
      year = parseInt(year, 10);

      citiesMap.update(year, denomination, denominationFamilySelection, countSelection);
    });
  })
  .catch((e) => {
    console.error(`There has been a problem with your fetch operation: ${e.message}`);
  });
