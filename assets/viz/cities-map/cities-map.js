import * as d3 from 'd3';
import Visualization from '../common/visualization';

export default class DenominationsMap extends Visualization {
  constructor(id, data, dim) {
    const margin = {
      top: 10, right: 10, bottom: 10, left: 10,
    };

    super(id, data, dim, margin);

    // The code below sets up the dropdowns for the map views. The views
    // currently include: year, denomination, and type of count. The first set
    // of variables reads in data to group and sort unique keys from the API. Then,
    // those are passed along to the dropdown and filters are then applied based on
    // the selections made in the dropdown.
    //
    // Filtering of this data happens below in the update() function.
    const yearSelect = [1906, 1926, 1932, 1936];
    const countType = ['Total churches', 'Total membership', 'Male', 'Female', '< 13', '> 13'];
    const denominationType = d3.groupSort(this.data.denominationFamilies['family_relec'], (d) => d.name, (d) => d.name);
    const stateSelect = d3.groupSort(this.data.cityMembership, (d) => d.state, (d) => d.state);

    d3.select('#state-dropdown')
      .append("label").text('Select a State')
      .append("select")
      .selectAll("option")
      .data(stateSelect)
      .enter().append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    d3.select('#year')
      .append("label").text('Select a Year')
      .append("select")
      .attr("id", "year_selection")
      .selectAll("option")
      .data(yearSelect)
      .enter().append("option")
      .attr("value", (d) => d)
      .text((d) => d)
      .property("selected", (d) => d === 1926); // default year

    d3.select('#denomination-dropdown')
      .append("label").text('Select a Denomination')
      .append("select")
      .selectAll("option")
      .data(denominationType)
      .enter().append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    d3.select('#count-dropdown')
      .append("label").text('Select a Count')
      .append("select")
      .selectAll("option")
      .data(countType)
      .enter().append("option")
      .attr("value", (d) => d)
      .text((d) => d)
      .property("selected", (d) => d === 'Total membership'); // default count

    // The following handles year data and zoom behavior.
    this.year = d3.select('#year').node().value = 1926; // default selected year -- probably a better way to handle this
    this.projection = d3.geoAlbers()
      .translate([this.width / 2 + 60, this.height / 2 + 40])
      .scale(550);
    this.path = d3.geoPath().projection(this.projection);

    // Provide object key for data joining
    this.key = (d) => d.city + d.state;

    // Keep track of which element is centered
    this.centered = null;

    // Keep track of how much to scale things based on zoom
    this.kScale = 1;
    this.radiusScale = 0.2;

    // The zoom function is called below in update() to handle zooming in and out on points
    // using the updated zoom(event, datum) => {...} changes in D3 v6+.
    this.zoom = (e, d) => {
      let x;
      let y;
      let k;
      if (d && this.centered !== d) {
        const coords = this.projection([d.lon, d.lat]);
        [x, y] = coords;
        k = 10;
        this.kScale = 8;
        this.radiusScale = 0.05;
        this.centered = d;
      } else {
        x = this.width / 2 - 10;
        y = this.height / 2 - 10;
        k = 1;
        this.kScale = 1;
        this.radiusScale = 0.2;
        this.centered = null;
      }

      this.viz
        .transition()
        .duration(500)
        .attr('transform', `translate(${this.width / 2},${this.height / 2})scale(${k}) translate(${-x},${-y})`);
      this.viz.selectAll('circle')
        .transition()
        .duration(500)
        .attr('r', (d) => d.denominations * this.radiusScale)
        .style('stroke-width', `${1 / this.kScale}px`);
      this.viz.selectAll('.country')
        .transition()
        .duration(500)
        .style('stroke-width', `${1 / k}px`);
    };

    this.tooltipRender = (e, d) => {
      const text = `Denomination count for ${d.city}, ${d.state} in ${d.year}<br/>`
        + `Denominations: ${d.denominations}<br/>`
        + `Churches: ${d.churches}<br/>`
        + `City population: ${d.population_1926}`;
      this.tooltip.html(text);
      this.tooltip.style('visibility', 'visible');
    };
  }

  // Draw the unchanging parts of the visualization
  render() {
    this.viz
      .selectAll('path')
      .data(this.data.northamerica.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('class', 'country');

    this.tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .attr('id', 'dioceses-map-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden');

    this.viz
      .append('rect')
      .attr('class', 'overlay')
      .attr('width', this.width)
      .attr('height', this.height)
      .on('click', this.zoom);

    // On first render, draw the stuff that gets updated
    this.update(this.year);
  }

  // Draw the stuff that gets updated
  update(year) {
    this.year = year;

    this.viz
      .selectAll('circle:not(.legend)')
      .data(this.currentSelectedYear(), this.key)
      .join(
        (enter) => enter
          .append('circle')
          .attr('cx', (d) => this.projection([d.lon, d.lat])[0])
          .attr('cy', (d) => this.projection([d.lon, d.lat])[1])
          .attr('r', (d) => d.denominations * this.radiusScale)
          .style('stroke-width', 1 / this.kScale)
          .attr('class', 'point'),
        (update) => update
          .attr('class', 'point'),
        (exit) => exit
          .remove(),
      );

    this.viz
      .selectAll('circle')
      .on('mouseover', this.tooltipRender)
      .on('mousemove', () => {
        // Show the tooltip to the right of the mouse, unless we are
        // on the rightmost 25% of the browser.
        if (event.clientX / this.width >= 0.75) {
          this.tooltip
            .style('top', `${event.pageY - 10}px`)
            .style('left', `${event.pageX - this.tooltip.node().getBoundingClientRect().width - 10}px`);
        } else {
          this.tooltip
            .style('top', `${event.pageY - 10}px`)
            .style('left', `${event.pageX + 10}px`);
        }
      })
      .on('mouseout', () => this.tooltip.style('visibility', 'hidden'))
      .on('click', this.zoom);
  }

  // Filter the data down to the dioceses that should be displayed in a year
  currentSelectedYear() {
    return this.data.cityMembership.filter((d) => d.year === this.year);
  }
}
