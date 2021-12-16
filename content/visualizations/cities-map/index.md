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
         <details>
          <summary><strong><small>How to use this visualization</small></strong></summary>
          <p><small>Using data from the published records of the U.S. Census of Religious Bodies, this map shows the number of churches for a specific denomination, represented by a yellow circle, in major cities. The larger the circle, the more churches were located in that area. Users can hover over the circle to see more information, including the number of churches and total church membership. To change the year or denomination featured, users can use the drop down boxes located above the map to change the filters. The “Select a year” box allows users to choose between 1906, 1916, 1926, and 1936. The “Select a denomination family” box allows users to choose a specific denomination family to see what denominations are included, or the user can select “All” to see all the denominations in the map. The “Select a denomination” box allows the user to choose which denomination will be featured in the map. Click on a point to zoom into that region; click anywhere else to zoom back out.</small></p>
        </details> 
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

