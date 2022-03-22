export function updateURL(year, denomination, denominationFamily, countSelection) {
  const url = new URL(window.location);
  url.searchParams.set("year", year);
  url.searchParams.set("denomination", denomination);
  url.searchParams.set("denominationFamily", denominationFamily);
  url.searchParams.set("countSelection", countSelection);

  let state = {
    year: year,
    denomination: denomination,
    denominationFamily: denominationFamily,
    countSelection: countSelection,
  };

  window.history.pushState(state, "", url);
}

// This function gets the state from the query parameters.
// If any one of the parameters is incorrect, then this function bails and
// returns null.
export function getInitialState() {
  const params = new URLSearchParams(location.search);

  const yearString = params.get("year");
  if (yearString === null) {
    return null;
  }
  const year = parseInt(yearString, 10);
  if (![1906, 1916, 1926, 1936].includes(year)) {
    return null;
  }

  const denomination = params.get("denomination");
  if (denomination === null) {
    return null;
  }

  const denominationFamily = params.get("denominationFamily");
  if (denominationFamily === null) {
    return null;
  }

  const countSelection = params.get("countSelection");
  if (countSelection === null) {
    return null;
  }

  return [year, denomination, denominationFamily, countSelection];
}

export function setDropDowns(year, denomination, denominationFamily, countSelection) {
  setDropdownOption("year_selection", year);
  setDropdownOptionQuery("[name=denomination-family-selection]", denominationFamily);
  setDropdownOptionQuery("[name=denomination-selection]", denomination);
  setDropdownOption("count_selection", countSelection);
}

function setDropdownOption(id, value) {
  let element = document.getElementById(id);
  element.value = value;
}

function setDropdownOptionQuery(query, value) {
  let element = document.querySelector(query);
  element.value = value;
}
