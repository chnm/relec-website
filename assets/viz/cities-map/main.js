import * as d3 from "d3";
import DenominationsMap from "./cities-map";
import { updateURL, getInitialState, setDropDowns } from "./urls";

// Load the data
const urls = [
  "http://localhost:8090/relcensus/denominations",
  "http://localhost:8090/relcensus/city-membership?year=1926&denomination=Protestant+Episcopal+Church",
  "http://localhost:8090/relcensus/city-membership?year=1926",
  "http://localhost:8090/relcensus/denomination-families",
  "http://localhost:8090/ne/northamerica/",
  "http://localhost:8090/ahcb/states/1926-07-04/",
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

  // Get initial state from the query params. If no query params, use the default.
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

  // We build the dropdown menus from the data and add event listeners to them
  // Add the options to the dropdowns
  const options = {
    // TODO: Re-enable the full year array when the years are available
    year: [1926], // [1906, 1916, 1926, 1936]
    denomination: ["All denominations", ...data[0].map((d) => d.short_name)],
    denominationFamily: ["All denomination families", ...data[3].family_relec.map((d) => d.name)],
    countSelection: ["Congregations", "Members"],
  }

console.log(data[3].family_relec[0].name);
console.log(initialState)

  // options.denomination needs to be filtered where a denomination is only displayed if it 
  // is part of a options.denominationFamily. We do this by getting the selected denominationFamily
  // either from initialState or the URL params, and then filtering the options.denomination array
  // to only include the denominations that are part of the selected denominationFamily. We need to 
  // match exactly the denominationFamily with family_relec.name, so we use the indexOf method.
  // To start, we create the family index. If initialState is not null, we use the values from initialState
  // to get the index. If initialState is null, we use data.family_relec[0].name to get the index.
  const denominationFamilyIndex = initialState !== null ? data[3].family_relec.findIndex((d) => d.name === initialState[2]) :
    data[3].family_relec.findIndex((d) => d.name === data[3].family_relec[0].name);
  // data[3].family_relec.findIndex((d) => d.name === denominationFamily);
  // Filter the denominations array to only include the denominations that are part of the selected denominationFamily
  // We need to handle any values that may be set in initialState, so we use the denominationFamilyIndex to get the
  // correct family_relec array. Otherwise, we use the values in data[0].filter family_relec[denominationFamilyIndex]
  const filteredDenominations = initialState !== null ? data[0].filter((d) => d.family_relec[denominationFamilyIndex].indexOf(d.short_name) !== -1) :
    data[0].filter((d) => d.family_relec[denominationFamilyIndex].indexOf(d.short_name) !== -1);



  // const filteredDenominations = data[0].filter((d) => d.family_relec[denominationFamilyIndex].indexOf(d.short_name) !== -1);
  const filteredDenominationOptions = ["All denominations", ...filteredDenominations.map((d) => d.short_name)];

  // sort the short_name alphabetically except for "All denominations"
  filteredDenominationOptions.sort((a, b) => {
    if (a === "All denominations") {
      return -1;
    } else if (b === "All denominations") {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  });

  // Build each of the dropdown elements.
  d3.select("#year-dropdown")
    .append("label")
    .text("Select a year")
    .append("select")
    .attr("id", "year_selection")
    .selectAll("option")
    .data(options.year)
    .join("option")
    .attr("value", (d) => d)
    .text((d) => d)
    .property("selected", 1926);

  d3.select("#counts-dropdown")
    .append("label")
    .text("Select a count total")
    .append("select")
    .attr("id", "count_selection")
    .selectAll("option")
    .data(options.countSelection)
    .join("option")
    .attr("value", (d) => d)
    .text((d) => d)
    .property("selected", "Congregations");

  const denominationFamilyDropdownValues = d3.select("#denomination-family-dropdown")
        .append("label")
        .text("Select a denomination family")
        .append("select")
        .attr("name", "denomination-family-selection");
         
  const denominationDropdownValues = d3.select("#denomination-dropdown")
        .append("label")
        .text("Select a denomination")
        .append("select")
        .attr("name", "denomination-selection");

  // Set the initial state of the dropdown menus
  denominationDropdownValues.selectAll("option")
    .data(filteredDenominationOptions)
    .join("option")
    .attr("value", (d) => d)
    .text((d) => d);

  denominationFamilyDropdownValues.selectAll("option")
    .data(options.denominationFamily)
    .join("option")
    .attr("value", (d) => d)
    .text((d) => d);
  
  // After the dropdowns are built, we set the initial state of the dropdowns
  // We set this to initialState unless it is empty, in which case we set it to the default
  // values.

  console.log(initialState);

  if (initialState === null) {
    d3.select("#year_selection").property("value", year);
    d3.select("#count_selection").property("value", countSelection);
    d3.select("select[name='denomination-family-selection']").property("value", denominationFamily);
    d3.select("select[name='denomination-selection']").property("value", denomination);
  } else {
    d3.select("#year_selection").property("value", year);
    d3.select("#count_selection").property("value", countSelection);
    d3.select("select[name='denomination-family-selection']").property("value", denominationFamily);
    d3.select("select[name='denomination-selection']").property("value", denomination);
  }

  // Add event listener to the family dropdown. When a user changes the family dropdown value, 
  // we need to update the denomination dropdown with the appropriate values. These then persist 
  // whether the user changes the dropdown or uses the URL params. We need an exact match, so we
  // use the indexOf method instead of includes().  
  denominationFamilyDropdownValues.on("change", function() {
    const denominationFamilySelection = d3.select(this).node().value;
    const filteredDenominations = data[0].filter((d) => d.family_relec === denominationFamilySelection);
    // const filteredDenominations = data[0].filter((d) => d.family_relec.includes(denominationFamilySelection));
    const filteredDenominationOptions = ["All denominations", ...filteredDenominations.map((d) => d.short_name)];
    
    // sort the short_name alphabetically except for "All denominations"
    filteredDenominationOptions.sort((a, b) => {
      if (a === "All denominations") {
        return -1;
      } else if (b === "All denominations") {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });
    denominationDropdownValues.selectAll("option").remove();
    denominationDropdownValues.selectAll("option")
      .data(filteredDenominationOptions)
      .join("option")
      .attr("value", (d) => d)
      .text((d) => d);
  });
    
  // This function updates the map, the URL/browser history and the citation.
  // It is defined here so that `citiesMap` is available to it.
  const updateAll = (year, denomination, denominationFamily, countSelection) => {
    citiesMap.update(year, denomination, denominationFamily, countSelection);
    updateURL(year, denomination, denominationFamily, countSelection);
    setDropDowns(year, denomination, denominationFamily, countSelection);
  };

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
