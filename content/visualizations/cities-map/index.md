---
title: "City Denominations Map"
date: 2021-07-19
updated: 2021-07-19
abstract: "Here is our abstract..."
script: viz/cities-map/main.js
styles: viz/cities-map/style.css
layout: visualization
thumbnail: citiesmap.png
thumbdesc: "A screenshot cities map..."
---

The interactive map below shows something awesome...

<div class="viz-block grid-x grid-padding-x">
  <div class="cell medium-12 xlarge-10 large-offset-1">
    <div class="row">
        <div class="columns small-12 medium-6">
            <div id="state-dropdown"></div>
        </div>
        <div class="columns small-12 medium-6">
            <div id="year-dropdown"></div>
        </div>
        <div class="columns small-12 medium-6">
            <div id="denomination-dropdown"></div>
        </div>
        <div class="columns small-12 medium-6">
            <div id="count-dropdown"></div>
        </div>
    </div>
  </div>
  <div class="cell medium-12 xlarge-10 large-offset-1">
    <h3>Cities map by year</h3>
    <svg id="chrono-map" width="100%"></svg>
  </div>
  <div id="controls" class="cell medium-12 xlarge-10 large-offset-1">
    <div class="grid-x grid-padding-x">
      <div class="cell medium-6 xlarge-6">
        <label for="year" class="float-left">1511</label>
        <label for="year" class="float-right">2020</label>
        <input type="range" id="year" name="year" min="1511" max="2020" step="1" value="1800" />
        <p class="instructions">
          <small><strong>How to use this visualization:</strong> Adjust the slider to control the year displayed in the map. Hover over points on the map to see details about each diocese or archdiocese. Click on a diocese to zoom into that region; click anywhere else to zoom back out. The bar chart also displays the number of dioceses established in your selected decade.</small>
        </p>
      </div>
    </div>
  </div>
</div>

Here's some more historical context and conclusions we've drawn from the map...

### Suggested citation

Please use the following as a suggested citation:

> "American City Denominations," *American Religious Ecologies*, Roy Rosenzweig Center for History and New Media, George Mason University (2020): <https://religiousecologies.org/visualizations/catholic-dioceses/>, <https://doi.org/10.31835/relec.dioceses>.

### Sources

The data for this map comes from...

### Notes

