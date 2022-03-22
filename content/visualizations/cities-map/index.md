---
title: "Urban American Congregations"
date: 2021-07-19
updated: 2022-02-16
abstract: "What we can learn from mapping the U.S. Census of Religious Bodies in the United States."
script: viz/cities-map/main.js
styles: viz/cities-map/style.css
layout: visualization
thumbnail: citiesmap.png
thumbdesc: "A screenshot of cities with denominations on a map of the United States."
doi: "https://doi.org/10.31835/relec.citiesmap"
---

In the early twentieth century, the U.S. Census Bureau conducted surveys of American religious congregations every ten years and published reports on the data it collected. The Bureau categorized denominations into different denomination families, linking together churches that had shared history, theology, or practice. This interactive map displays congregations by denominations and denominational families in American cities, including places with 25,000 or more residents. This map does not display congregations in rural areas or smaller towns.

<div class="viz-block grid-x grid-padding-x">
  <div id="controls" class="cell medium-12 xlarge-10 large-offset-1">
    <div class="grid-x grid-padding-x">
      <div class="cell large-12 how-to">
        <p class="instructions">
         <details>
          <summary><strong><small>How to use this visualization</small></strong></summary>
          <p><small>Using data from the published records of the U.S. Census of Religious Bodies, this map shows the number of congregations or members for a specific denomination, represented by a yellow circle, in major cities. You can also view the data for all the congregations within a denomination family, or for every kind of religious group counted by the Census Bureau. The larger the circle, the more churches or members were located in that area. Users can hover over the circle to see more information, including the number of congregations and area denominational membership. The map currently features the data from the 1926 census, and data from other censuses will be added later. The “Select a denomination family” box allows users to choose a specific denomination family to see what denominations are included. The “Select a denomination” box allows the user to choose which denomination will be featured in the map. Click on a point to zoom into that region; click anywhere else to zoom back out.</small></p>
        </details> 
        </p>
      </div>
    </div>
  </div>
  <div class="cell medium-12 xlarge-10 large-offset-1">
    <div class="row menu">
        <div class="columns small-12 medium-6">
            <div id="year-dropdown" class="filterSelection" name="year"></div>
        </div>
        <div class="columns small-12 medium-6">
            <div id="counts-dropdown" class="filterSelection"></div>
        </div>
      </div>
    <div class="row menu">
        <div class="columns small-12 medium-6">
            <div id="denomination-family-dropdown" class="filterSelection"></div>
        </div>
        <div class="columns small-12 medium-6">
          <div id="denomination-dropdown" class="filterSelection"></div>
        </div>
    </div>
  </div>
  <div class="cell medium-12 xlarge-10 large-offset-1">
    <h3 class="graphic-title">Map of <span class="denomination-title">denominations</span> <span class="count-title">congregations</span> in US Cities, <span class="year-title">1926</span></h3>
    <svg id="chrono-map" width="100%"></svg>
  </div>
</div>

The U.S. Census of Religious Bodies conducted four decennial censuses of religious congregations across the United States between 1906 and 1936. When it published the results of each census, the Bureau included aggregated membership figures by county, and also detailed religious statistics for each city in the country with a population of at least 25,000. Other scholars have created maps utilizing the county-level data, but the city-level data enables a more precise visualization of the urban landscape of American religion.

This map utilizes concentric circles to represent the number of congregations or members of a certain denomination within cities in a given census year. Because the Census Bureau tabulated place-specific data for only cities with 25,000 or more residents, this map does not display congregations located in rural areas or smaller towns.

The early twentieth century was an era of rapid urbanization and population growth in the United States. In 1906, there were 160 cities with a population of 25,000 or more residents. By 1936, there were 378 such cities. The overall growth in congregations and membership during these decades reflects these broader trends.

Some large denominations, such as the Protestant Episcopal Church, had a presence across urban areas in the United States throughout this period. Other denominations, such as the Southern Baptists, were largely confined to a single region. Nonetheless, this map demonstrates that even denominations often thought of as regionally specific had a significant presence in many other places. The Church of Jesus Christ of Latter-day Saints, for example, was concentrated in Salt Lake City, Utah, but had at least one congregation in dozens of other cities throughout the entire United States. There are many other such observations for scholars to make from the cities-level data we have transcribed and made available here.

### Suggested citation

Please use the following as a suggested citation:

{{< citation >}}

### Sources

U.S. Census Bureau. Religious Bodies: 1906. 2 vols. Washington, DC: Government Printing Office, 1910. <https://catalog.hathitrust.org/Record/008603051>

U.S. Census Bureau. Religious Bodies: 1916. 2 vols. Washington, DC: Government Printing Office, 1920. <https://catalog.hathitrust.org/Record/102180335>

U.S. Census Bureau. Religious Bodies: 1926. 2 vols. Washington, DC: Government Printing Office, 1930. <https://catalog.hathitrust.org/Record/102366493>

U.S. Census Bureau. Religious Bodies: 1936. 2 vols. Washington, DC: Government Printing Office, 1940. <https://catalog.hathitrust.org/Record/102180336>


