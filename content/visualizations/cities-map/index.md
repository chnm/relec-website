---
title: "City Denominations Map"
date: 2021-07-19
updated: 2021-11-15
abstract: "Here is our abstract..."
script: viz/cities-map/main.js
styles: viz/cities-map/style.css
layout: visualization
thumbnail: citiesmap.png
thumbdesc: "A screenshot cities map..."
doi: "https://doi.org/1234/1234"
---

The interactive map below shows something awesome...

<div class="viz-block grid-x grid-padding-x">
  <div class="cell medium-12 xlarge-10 large-offset-1">
    <div class="row menu">
        <div class="columns small-12 medium-6">
            <div id="year-dropdown" class="filterSelection" name="year"></div>
        </div>
        <div class="columns small-12 medium-6">
            <div id="denomination-family-dropdown" class="filterSelection"></div>
        </div>
        <div class="columns small-12 medium-6">
            <div id="counts-dropdown" class="filterSelection"></div>
        </div>
      </div>
    <div class="row menu">
      <div id="denomination-dropdown" class="filterSelection"></div>
    </div>
  </div>
  <div class="cell medium-12 xlarge-10 large-offset-1">
    <h3>Denominations map</h3>
    <svg id="chrono-map" width="100%"></svg>
  </div>
  <div id="controls" class="cell medium-12 xlarge-10 large-offset-1">
    <div class="grid-x grid-padding-x">
      <div class="cell medium-6 xlarge-6">
        <p class="instructions">
          <small><strong>How to use this visualization:</strong> Adjust the filters to control the data displayed in the map. Hover over points on the map to see details about each location. Click on a point to zoom into that region; click anywhere else to zoom back out.</small>
        </p>
      </div>
    </div>
  </div>
</div>

Here's some more historical context and conclusions we've drawn from the map...

### Suggested citation

Please use the following as a suggested citation:

{{< citation >}}

### Sources

The data for this map comes from...

### Notes

