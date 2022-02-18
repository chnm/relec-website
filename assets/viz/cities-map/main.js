import * as d3 from "d3";
import DenominationsMap from "./cities-map";
import { updateURL, getInitialState, setDropDowns } from "./urls";

// Load the data
const urls = [
  "https://data.chnm.org/relcensus/denominations",
  "https://data.chnm.org/relcensus/city-membership?year=1926&denomination=Protestant+Episcopal+Church",
  "https://data.chnm.org/relcensus/city-membership?year=1926",
  "https://data.chnm.org/relcensus/denomination-families",
  "https://data.chnm.org/ne/northamerica/",
  "https://data.chnm.org/ahcb/states/1926-07-04/",
];
const promises = [];
urls.forEach((url) => promises.push(d3.json(url)));

// Once all the data is loaded, initialize and render the visualizations
Promise.all(promises)
  .then((data) => {
    setup(data);
  })
  .catch((e) => {
    console.error(`There has been a problem with your fetch operation: ${e.message}`);
  });

function setup(data) {
  const citiesMap = new DenominationsMap(
    "#chrono-map",
    {
      denominations: data[0],
      cityMembership: data[1],
      denominationAggregate: data[2],
      denominationFamilies: data[3],
      northamerica: data[4],
      states: data[5],
    },
    { width: 1000, height: 525 }
  );
  citiesMap.render();

  // This function updates the map, the URL/browser history and the citation.
  // It is defined here so that `citiesMap` is available to it.
  const updateAll = (year, denomination, denominationFamily, countSelection) => {
    citiesMap.update(year, denomination, denominationFamily, countSelection);
    updateURL(year, denomination, denominationFamily, countSelection);
  };

  // Get initial state from the query params
  let year, denomination, denominationFamily, countSelection;
  const initialState = getInitialState();
  if (initialState === null) {
    year = 1926;
    denomination = "All denominations";
    denominationFamily = "Adventist";
    countSelection = "Congregations";
  } else {
    [year, denomination, denominationFamily, countSelection] = initialState;
  }

  // Now update everything for the first time based on that initial state.
  // For the first time we have to set the dropdowns too.
  updateAll(year, denomination, denominationFamily, countSelection);
  setDropDowns(year, denomination, denominationFamily, countSelection);

  // Listen for changes to the filter options and return them to update() and re-render the map.
  d3.selectAll(".filterSelection").on("change", async () => {
    let year = d3.select("#year-dropdown option:checked").text();
    const denomination = d3.select("#denomination-dropdown option:checked").text();
    const denominationFamily = d3.select("#denomination-family-dropdown option:checked").text();
    const countSelection = d3.select("#counts-dropdown option:checked").text();

    // Convert year from string to number
    year = parseInt(year, 10);

    updateAll(year, denomination, denominationFamily, countSelection);
  });
}
