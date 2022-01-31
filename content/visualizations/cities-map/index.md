---
title: "City Denominations"
date: 2021-07-19
updated: 2022-01-19
abstract: "What we can learn from mapping the U.S. Census of Religious Bodies in the United States."
script: viz/cities-map/main.js
styles: viz/cities-map/style.css
layout: visualization
thumbnail: citiesmap.png
thumbdesc: "A screenshot of cities with denominations on a map of the United States."
doi: "https://doi.org/1234/1234"
---

This interactive map below shows different denominations’ presence in large cities in the United States in the years 1906, 1916, 1926, and 1936, when the U.S. Census of Religious Bodies conducted censuses of different churches and congregations and published official reports. The Census Bureau categorized denominations by different denomination families, linking together churches that share broader religious overlap. Cities included are those with over 25,000 residents.

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
    <h3 class="graphic-title">Map of <span class="denomination-title">denominations</span> <span class="count-title">congregations</span> in US Cities, <span class="year-title">1926</span></h3>
    <h5 class="graphic-title">Cities included are those with Populations over 25,000</h5>
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

The U.S. Census of Religious Bodies conducted four censuses categorizing religious congregations across the United States throughout the decades of 1906 to 1936. In doing so, the Census Bureau categorized different churches by both denominations and denominational families. This map displays circles that represent the number of churches of a certain denomination in cities in the different years of the census. This map does not display all the congregations of a denomination across the country, but instead focuses on urban areas.

In 1906, there were only 160 cities that met the Census Bureau's criteria as an "urban" area, with over 25,000 residents. In 1936, there were 378 cities that met the criteria as urban. Because of the growth in the number of larger cities, the higher number of churches represented in the 1936 map also represents the growth of urban areas throughout the decades. 

Some denominations, such as the Protestant Episcopal Church, had a large presence across urban areas in the United States in the different years, with large circles located in cities such as New York City, with 194 churches and 141,205 church members, or across the country in Los Angeles, with 29 churches and 13,894 members, all in 1926. Other denominations had less of a coast-to-coast presence in cities throughout the years, such as the Primitive Baptists. In 1906, the Primitive Baptists denomination 1 church in Seattle, Washington, with 14 members; otherwise the churches were located in the Eastern United States. In later years, there was no western presence of Primitive Baptists in urban areas. 

Nonetheless, this map demonstrates that even denominations often thought of as regionally-specific had concentrations throughout the United States in larger cities. The Church of Jesus Christ of Latter-Day Saints, for example, had the largest congregation of churches in Salt Lake City, Utah, but had at least one church in dozens of other cities throughout the entire United States in 1926 and 1936. 

Using the data from the Census Bureau at the city level instead of at the state or county level, and utilizing schedule data we have digitized, this map provides a more precise look at where certain denominations were prevalent within urban areas. 

### Suggested citation

Please use the following as a suggested citation:

{{< citation >}}

### Sources

The data for this map comes from...

### Notes

