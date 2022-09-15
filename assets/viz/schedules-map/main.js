import * as d3 from "d3";
import SchedulesMap from "./schedules-map";
import { updateURL, getInitialState, setDropDowns } from "./urls";

// Load the data
const urls = [
  "https://data.chnm.org/relcensus/schedules/",
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
  const schedulesMap = new SchedulesMap(
    "#chrono-map",
    {
      schedules: data[0],
      northamerica: data[1],
      states: data[2],
    },
    { width: 1000, height: 525 }
  );
  schedulesMap.render();

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
    year: [1926],
    denomination: ["All denominations", ...data[0].map((d) => d.short_name)],
    denominationFamily: ["All denomination families", ...data[3].family_relec.map((d) => d.name)],
    countSelection: ["Congregations", "Members"],
  }

  // options.denomination needs to be filtered where a denomination is only displayed if it 
  // is part of a options.denominationFamily. We do this by getting the selected denominationFamily
  // either from initialState or the URL params, and then filtering the options.denomination array
  // to only include the denominations that are part of the selected denominationFamily. We need to 
  // match exactly the denominationFamily with family_relec.name, so we use the indexOf method.
  const denominationFamilyIndex = data[3].family_relec.findIndex((d) => d.name === denominationFamily);
  const filteredDenominations = data[0].filter((d) => d.family_relec[denominationFamilyIndex].indexOf(d.short_name) !== -1);
  const filteredDenominationOptions = ["All denominations", ...filteredDenominations.map((d) => d.short_name)];

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
  // It is defined here so that `schedulesMap` is available to it.
  const updateAll = (year, denomination, denominationFamily, countSelection) => {
    schedulesMap.update(year, denomination, denominationFamily, countSelection);
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
