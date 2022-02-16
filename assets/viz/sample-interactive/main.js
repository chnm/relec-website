import * as Plot from "@observablehq/plot";
import citiesTotal from "./city-total-membership.json";
import * as params from "@params";

const width = 800;

let denominationsPlot = Plot.plot({
  width: width,
  height: 0.5 * width,
  x: { type: "log", label: "City population in 1926", tickFormat: "~s" },
  y: { label: "Number of distinct denominations" },
  grid: true,
  marks: [
    Plot.dot(citiesTotal, {
      x: "population_1926",
      y: "denominations",
      stroke: "blue",
      title: (d) => `${d.city}, ${d.state}`,
    }),
    Plot.text(
      citiesTotal.filter(
        (d) =>
          d.population_1926 > 280e3 && !["Minneapolis", "St. Louis", "San Francisco", "Cincinnati"].includes(d.city)
      ),
      {
        x: (d) => d.population_1926,
        y: (d) => d.denominations - 2,
        text: "city",
      }
    ),
  ],
});

document.getElementById(params.id).appendChild(denominationsPlot);
