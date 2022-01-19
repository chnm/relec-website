import * as d3 from 'd3';
import LDSMap from './lds-map';

// Load the data
const urls = [
    'https://data.chnm.org/relcensus/city-membership?year=1926&denomination=Church+of+Jesus+Christ+of+Latter-day+Saints',
    'https://data.chnm.org/relcensus/city-membership?year=1926&denomination=Reorganized+Church+of+Jesus+Christ+of+Latter+Day+Saints',
    'https://data.chnm.org/ne/northamerica/',
    'https://data.chnm.org/ahcb/states/1926-07-04/',
];
const promises = [];
urls.forEach((url) => promises.push(d3.json(url)));

// Once all the data is loaded, initialize and render the visualizations
Promise.all(promises)
  .then((data) => {
    const LdsMap = new LDSMap(
        '#lds-map',
        {
          lds: data[0],
          rlds: data[1],
          northamerica: data[2],
          states: data[3],
        },
        { width: 1000, height: 600 },
      );
      LdsMap.render();
  });
