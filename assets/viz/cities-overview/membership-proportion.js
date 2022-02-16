import * as Plot from "@observablehq/plot";
import citiesTotal from "./city-total-membership.json";
import * as params from "@params";

const width = 800;

function membershipProportion(d) {
  let prop = d.members_total / d.population_1926;
  return prop <= 1 ? prop : 1;
}

let membershipPlot = Plot.plot({
  width: width,
  marginRight: 40,
  height: 0.5 * width,
  x: { type: "log", label: "City population in 1926", tickFormat: "~s" },
  y: {
    percent: true,
    label: "Percentage of city population counted as congregational members",
  },
  grid: true,
  marks: [
    Plot.dot(citiesTotal, {
      x: "population_1926",
      y: (d) => membershipProportion(d),
      stroke: "green",
      title: (d) => `${d.city}, ${d.state}`,
    }),
    Plot.text(
      citiesTotal.filter(
        (d) =>
          d.population_1926 > 270e3 &&
          !["Portland", "New Orleans", "Boston", "Milwaukee", "Minneapolis"].includes(d.city)
      ),
      {
        x: (d) => d.population_1926,
        y: (d) => membershipProportion(d) - 0.02,
        text: "city",
      }
    ),
  ],
});

document.getElementById(params.id).appendChild(membershipPlot);
