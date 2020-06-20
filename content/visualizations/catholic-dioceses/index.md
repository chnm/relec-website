---
title: "Roman Catholic Dioceses in North America"
date: 2020-06-20
updated: 2020-06-20
abstract: "How mapping Roman Catholic dioceses illustrates key concepts of religious ecologies at a continental scale."
script: viz/catholic-dioceses.js
layout: visualization
thumbnail: dioceses.png
thumbdesc: "A screenshot showing the distribution of dioceses in North America."
---

The interactive map below shows the development of Roman Catholic dioceses in North America from the establishment of the first dioceses in 1511 until the present. Included are dioceses located in the current boundaries of Canada, the United States, Mexico, Cuba, the Dominican Republic, Haiti, and the Bahamas. A diocese is the main administrative unit of the Roman Catholic church, in which a bishop presides over the churches within his territory. An archdiocese is likewise presided over by an archbishop, and most archdioceses are metropolitan sees that govern several other dioceses.

<div class="grid-x grid-padding-x">
  <div class="cell medium-12 xlarge-10">
    <h4>Latin Rite Roman Catholic dioceses and archdioceses by year</h4>
    <svg id="chrono-map" width="100%"></svg>
  </div>
  <div id="controls" class="cell medium-12 xlarge-10">
    <div class="grid-x grid-padding-x">
      <div class="cell medium-6 xlarge-6">
        <label for="year" class="float-left">1511</label>
        <label for="year" class="float-right">2020</label>
        <input type="range" id="year" name="year" min="1511" max="2020" step="1" value="1800" />
        <p class="instructions">
          <small><strong>How to use this visualization:</strong> Adjust the slider to control the year displayed in the map. Hover over points on the map to see details about each diocese or archdiocese. Click on a diocese to zoom into that region; click anywhere else to zoom back out. The bar chart also displays the number of dioceses established in your selected decade.</small>
        </p>
        <p class="instructions">
          <small>See below for a <a href="#rite-map-container">map of non–Latin Rite Dioceses</a>.</small>
        </p>
      </div>
      <div class="cell medium-6 xlarge-6">
        <h4>Dioceses established per decade</h4>
        <svg id="barchart" width="100%"></svg>
      </div>
    </div>
  </div>
</div>

This map offers a way to see a religious ecosystem at a transnational and even continental scale. Because it is a map of dioceses, the map shows the institutional structures of the Roman Catholic church at a high vantage point within the church hierarchy. It can therefore reflect only indirectly on questions about the church outside of institutional structures or at a much more detailed level of analysis, such as the parish-level understanding that we are seeking to recreate by digitizing the 1926 Census of Religious Bodies.[^1] Nevertheless, the map lets us see at least some of the dynamics of a religious ecology.

The *American Religious Ecologies* project is creating new datasets and visualizations for the study of American religious history. Datasets and visualizations, though, are means to the end of creating historical interpretations that advance our knowledge of American religious history. In particular, we are seeking to understand American religion through the lens of religious ecologies. The term *ecology of religion* encourages us to look at the interactions of religious groups with one another, as well as their interactions with their geographic, political, cultural, and social environments. Using this map we can see ways, even on this large scale, in which Roman Catholicism has interacted with its larger geopolitical environment. Indeed, scale is part of the point: while most studies of religion that take an ecological framework have focused on the scale of the street, the block, or the city, the concept is also useful at larger scales.[^4] 

There are three things we can observe about religious ecologies at this continental scale.

The first thing to note is the transnational scope of Roman Catholicism. Perhaps this point is obvious in the case of a global church like Roman Catholicism, but  the point is made more striking when depicted in geographical space. Without denying the significance of the nation for understanding religious developments, the boundaries of the nation-state are only sometimes the appropriate boundaries for the study of a religious tradition.

Take, for instance, the map in 1789, the first year for which the background political boundaries displayed on the map are even approximately correct.[^2] That year saw the establishment of the Diocese of Baltimore, the first Roman Catholic diocese in the newly formed United States. The founding of a new nation enabled the creation of a new diocese, even if the presence of a Roman Catholic diocese in the British-controlled province of Quebec, formerly a French colonial possession, had been at issue in the lead-up to the American revolution. But the presence of institutional Roman Catholicism on the continent was hardly limited to those two dioceses. By 1789, Roman Catholic dioceses had been established for nearly three centuries on the continent. The first two were the diocese of San Juan and the diocese of Santo Domingo, now in Puerto Rico and the Dominican Republic. In 1789, there were two dioceses north of the Rio Grande, but there were ten in the territory that became Mexico and four in the Caribbean. The institutional hierarchy of the Roman Catholic church was thus well developed on the continent long before the founding of the United States and Canada as nation states.

The changing political boundaries of empires and nations on the continent raises a second question: what happens when national borders change, but Catholic dioceses remain in place? As institutions, Catholic dioceses are extraordinarily long-lived. Very few are suppressed once they have been established. Even suppressed dioceses often become titular sees, serving an institutional purpose though no longer functioning as a unit of administration.[^3] (This map could have been inverted to show the stability of Catholic dioceses over against changing borders instead of showing changing dioceses against a stable background layer.)

Long-standing dioceses remained in place while political borders changed around them. Take as an example one of the earliest dioceses to have been founded in North America. The diocese of San Juan was established within the Spanish Empire in 1511. Following the Spanish-American war, it was located within a territorial possession of the United States. Likewise the diocese of New Orleans, founded in 1793, has been located within Spanish, French, and American empires.

The borders that change around dioceses can be relatively open or closed. The demographic distribution of Roman Catholics along the border between the northeastern United States and southeastern Canada looks much the same as if there were no border. And so the Catholic dioceses along that border are dispersed among the major cities of Quebec, Ontario, and New Brunswick, on the one side of the border, and the major cities of New York, Vermont, New Hampshire, and Maine on the other, just as they might be if they were not near a border. 

Along the more tightly controlled border between the United States and Mexico, the situation is rather different. Take, for instance, the Diocese of Brownsville in the United States and the Diocese of Matamoros in Mexico. Though divided by the Rio Grande and an international border, Matamoros-Brownsville is functionally a single urban unit, one of several such cross-border cities. The two dioceses were established within years of one another in the 1960s, and their cathedrals are a mere two miles apart. These two dioceses are distinct because they are on separate sides of a rather fraught border. And yet, in a way that would not happen in other places, the two dioceses exist within the same city. A similar dynamic, perhaps, can be found among the historically contested border between the United States and Canada now dividing Washington State from British Columbia.

The third observation is that the map demonstrates two patterns of growth in Catholic dioceses, which we can term extensive growth versus intensive growth. The sixteenth century saw a few initial dioceses established in connection with the Spanish Empire, followed by a few more dioceses established in the eighteenth century. But the first period of major growth in the number of dioceses established was the nineteenth century, at least in part in response to waves of immigration and rapid population growth. The growth in the number of dioceses, like the growth of population, was extensive, as dioceses followed the spread of settler colonists across the continent. One of the earliest dioceses established in the U.S., for example, was the Diocese of Bardstown, Kentucky, a frontier outpost in 1808. The Dioceses of Monterrey and Los Angeles were established in Mexican territory, only later to become part of the United States following the Mexican War and U.S. settlement in California. The foundation of Catholic dioceses in the United States more or less followed the same pattern as the [admission of states](https://lincolnmullen.com/projects/us-boundaries/).

The second major period of growth happened during the reforms of the Roman Catholic Church in the period leading up to and encompassing the Second Vatican Council. The growth in the number of dioceses during this period was intensive, meaning that dioceses were established in close geographic proximity to one another. This was a process driven by the high rates of religious affiliation in the United States during the 1950s, population growth and increasing urbanization, and the institutional reform of the church. As an example, take the archdiocese in Mexico City. Founded in 1530 as only the fifth diocese on the continent, there are now many more dioceses in close geographic proximity to the archiepiscopal see.

The difference between extensive and intensive growth is an important concept for understanding religious ecologies. A diocese established in response to a growing but spreading population has a different relationship to its environment and to the rest of the institutional church than dioceses that are established in a place where the growth is intensive. As for the flip side of growth, there has been relatively little retrenchment of dioceses: only a handful have been suppressed over the past five centuries. But in the twenty-first century, the number of ex-Catholics has grown enormously due to the clerical sex abuse scandal, and next to no new dioceses have been established in North America.

<div class="grid-x grid-padding-x" id="rite-map-container">
  <div class="cell medium-10 xlarge-9">
    <h4>Non&ndash;Latin Rite Dioceses in North America (Present Day)</h4>
    <svg id="rite-map" width="100%"></svg>
  </div>
</div>

A particularly interesting form of intensive growth is the arrival of non-Latin Rite dioceses in North America. The Roman (thus Latin) Catholic Church is in communion with twenty-three Eastern Catholic Churches which recognize the authority of the Pope. These churches have their own liturgical rites, derived from their historic connection to the Orthodox churches of the East as opposed to Roman churches of the West. While dioceses are territorial, meaning that their authority does not usually overlap geographically, the Eastern Catholic Churches serve different Christians than the Latin Rite churches, and so they have their own dioceses. The first such diocese in North America  was established in Philadelphia in 1924, with a handful of others established over the next several decades. But the number of these dioceses has greatly expanded since 1965. This growth can be explained in part because the United States opened up immigration from the countries that were the geographic home of the Eastern Catholic churches. But at the same time, the Second Vatican Council's decree *Orientalium Ecclesiarum* (1964) reversed the process by which these eastern churches were being Latinized, or brought into greater conformity with the Latin Rite, and encouraged their distinctive identity among the churches in communion with the papacy.

A map of dioceses necessarily represents a limited picture of Roman Catholicism in North America, and it can only track the institutional church at its highest levels of organization rather than provide evidence for more complex and granular understandings of American religion. Nevertheless, this continental scale shows how concepts from the idea of religious ecologies can be used to understand the relationship of churches to their environment. It demonstrates the transnational significance of religious groups and the relationship of churches to national borders, as well as a distinction between intensive and extensive growth.

### Suggested citation

Please use the following as a suggested citation:

> "Roman Catholic Dioceses in North America," *American Religious Ecologies*, Roy Rosenzweig Center for History and New Media, George Mason University (2020): <https://religiousecologies.org/visualizations/catholic-dioceses/>, <https://doi.org/10.31835/relec.dioceses>.

### Sources

The data for this map comes from several locations. The bulk of the data comes from Joseph Bernard Code, *Dictionary of the American Hierarchy (1789-1964)* (New York: Joseph F. Wagner, 1964), 425--26. This data was supplemented by information from [catholic-hierarchy.org](http://www.catholic-hierarchy.org) for the [United States](http://www.catholic-hierarchy.org/country/dus2.html), [Mexico](http://www.catholic-hierarchy.org/country/dmx.html), and [Canada](http://www.catholic-hierarchy.org/country/dca2.html). Additional information, including data for suppressed dioceses, came from the website [gcatholic.org](http://www.gcatholic.org).

### Notes

[^1]: In the United States, at least, the presence and practice of Catholicism has often been carried out by lay Catholics in the absence of bishops and dioceses, and even without priests. See James M. O'Toole, *The Faithful: A History of Catholics in America* (Belknap Press, 2008), ch. 1.

[^2]: While it would be desirable for the political boundaries on this map to change over time as well, gathering that spatial data was beyond the scope of this project. The boundaries of contemporary political units, even if anachronistic for most of the time period depicted on the map, are necessary to orient the user in space.

[^3]: We have attempted to include suppressed dioceses, though our sources are stronger on suppressed dioceses in the United States than in other places, and we have not made an attempt to capture every detail of the dynamics of changing dioceses. Titular sees are not represented.

[^4]: For example, Katie Day, *Faith on the Avenue: Religion on a City Street* (Oxford University Press, 2014) or Wallace D. Best, *Passionately Human, No Less Divine: Religion and Culture in Black Chicago, 1915–1952* (Princeton University Press, 2005).
