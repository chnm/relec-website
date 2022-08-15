import * as L from "leaflet";
import { leafletCSS } from "../common/leaflet-css";
import data from "./spiritualist.json";

leafletCSS(L.version); // Add the leaflet CSS in the correct version
var map = L.map("spiritualist-map").setView([39.953, -75.265], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(map);

var geojsonMarkerOptions = {
  radius: 9,
  weight: 2,
  opacity: 2,
  fillOpacity: 0.2,
};

var points = L.geoJSON(data, {
  pointToLayer: function (feature, latlng) {
    let options = geojsonMarkerOptions;
    switch (feature.properties.pastor_gender) {
      case "Female":
        options.color = "purple";
        options.fillColor = "purple";
        break;
      case "Male":
        options.color = "blue";
        options.fillColor = "blue";
        break;
      case "Unknown":
        options.color = "black";
        options.fillColor = "black";
        break;
      case "None":
        options.color = "red";
        options.fillcolor = "red";
        break;
    }
    return L.circleMarker(latlng, options);
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      `
            <div class="popup">
                <strong>Pastor:</strong> ${feature.properties.pastor_name}<br/>
                <strong>Gender:</strong> ${feature.properties.pastor_gender}<br/>
                <a href="${feature.properties.url}" target="_blank">Link to census schedule</a>
            </div>
            `
    );
  },
});
points.addTo(map);

map.fitBounds(points.getBounds());

// Add the legend for each of the properties.pastor_gender values
const legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend'),
        labels = ["Female", "Male", "None", "Unknown"],
        colors = ["purple", "blue", "black", "red"];
        // labels = [];

    // Loop through the grades and display their color 
    for (let i = 0; i < labels.length; i++) {
      div.innerHTML += 
      '<div class="legend-label"><i style="background:' + colors[i] + '"></i> ' +
      labels[i] + '</div>';
    }

    return div;
};

legend.addTo(map);

// Handle filtering of the markers on the map
const filter = document.getElementById("filter");
filter.addEventListener("change", function (e) {
  const value = e.target.value;
  console.log(value);
  points.eachLayer(function (layer) {
    if (layer.feature.properties.pastor_gender
      .includes(value)) {
      layer.addTo(map);
    }
    else if (value === "All") {
      layer.addTo(map);
    }
    else {
      map.removeLayer(layer);
    }
  });
});