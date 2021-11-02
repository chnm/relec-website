/* eslint-disable max-len */
import * as d3 from 'd3';
import Visualization from '../common/visualization';

export default class DenominationsMap extends Visualization {
  constructor(id, data, dim) {
    const margin = {
      top: 10, right: 10, bottom: 10, left: 10,
    };

    super(id, data, dim, margin);

    // The code below sets up the dropdowns for the map views. The views
    // currently include: year and denomination. The first set
    // of variables reads in data to group and sort unique keys from the API. Then,
    // those are passed along to the dropdown and filters are then applied based on
    // the selections made in the dropdown.
    //
    // Filtering of this data happens below in the update() function.

    // Our year options that are available.
    const yearSelect = [1906, 1916, 1926, 1936];

    // Fetch the list of denominations and denomination families from the API,
    // and use d3.groupSort to organize them.
    const denominationType = d3.groupSort(this.data.denominations, (d) => d.name, (d) => d.name);
    const denomFamilies = d3.groupSort(this.data.denominationFamilies.family_relec, (d) => d.name, (d) => d.name);

    // We use the spread operator to create an array that includes an
    // "All" option and appends the data from the API.
    const denominationSelection = ['All', ...denominationType];
    const denominationFamilySelection = ['All', ...denomFamilies];

    // Build each of the dropdown elements.
    d3.select('#year-dropdown')
      .append('label').text('Select a year')
      .append('select')
      .attr('id', 'year_selection')
      .selectAll('option')
      .data(yearSelect)
      .enter()
      .append('option')
      .attr('value', (d) => d)
      .text((d) => d)
      .property('selected', (d) => d === 1926) // default year -- TODO: should this be an index instead?
      .on('change', this.zoom);

    d3.select('#denomination-dropdown')
      .append('label').text('Select a denomination')
      .append('select')
      .selectAll('option')
      .data(denominationSelection)
      .enter()
      .append('option')
      .attr('value', (d) => d)
      .text((d) => d)
      .property('selected', (d) => d === 'Protestant Episcopal Church') // default denomination
      .on('change', this.zoom);

    d3.select('#denomination-family-dropdown')
      .append('label').text('Select a denomination family')
      .append('select')
      .selectAll('option')
      .data(denominationFamilySelection)
      .enter()
      .append('option')
      .attr('value', (d) => d)
      .text((d) => d)
      .on('change', this.zoom);

    // The following handles year data, map projections, and zoom behavior.
    this.projection = d3.geoAlbers()
      .translate([this.width / 2 + 60, this.height / 2 + 40])
      .scale(1000);
    this.path = d3.geoPath().projection(this.projection);

    // Keep track of which element is centered
    this.centered = null;

    // Keep track of how much to scale things based on zoom
    this.kScale = 0.5;

    // Handle point radius scaling
    this.populationRadiusScale = d3.scaleSqrt()
      .domain([3, 200])
      .range([5, 50]);
    // TODO: This will be updated to something more like this, but generalized:
    // this.populationRadiusScale = d3.scaleSqrt()
    // .domain([d3.min(this.data.cityMembership, (d) => d.churches),
    //   d3.max(this.data.cityMembership, (d) => d.churches)])
    // .range([0, 100]);

    this.radius = d3.scaleSqrt([0, 200], [5, 60]);

    // radius = d3.scaleSqrt([0, d3.max(data, d => d.value)], [0, 40])
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
        this.centered = d;
      } else {
        x = this.width / 2 - 10;
        y = this.height / 2 - 10;
        k = 1;
        this.kScale = 1;
        this.centered = null;
      }

      this.viz
        .transition()
        .duration(500)
        .attr('transform', `translate(${this.width / 2},${this.height / 2})scale(${k}) translate(${-x},${-y})`);
      this.viz.selectAll('circle:not(.legend)')
        .transition()
        .duration(500)
        .attr('r', (d) => this.populationRadiusScale(d.churches))
        .style('stroke-width', `${0.5 / this.kScale}px`);
      this.viz.selectAll('.country')
        .transition()
        .duration(500)
        .style('stroke-width', `${0.5 / this.kScale}px`);
      this.viz.selectAll('.states')
        .transition()
        .duration(500)
        .style('stroke-width', `${0.5 / this.kScale}px`);
    };

    // The tooltip is conditional based on whether we're displaying
    // All data or a single denomination.
    this.tooltipRender = (e, d) => {
      if (this.denomination === 'All') {
        // We use JS native .toLocalString() to display thousands separator based on user's locale
        const text = `Denomination count for <strong>${d.city}, ${d.state}</strong> in <strong>${d.year}</strong><br/>`
        + `Number of denominations: ${d.denominations.toLocaleString()}<br/>`
        + `Number of churches: ${d.churches.toLocaleString()}<br/>`
        + `City population: ${d.population_1926.toLocaleString()}`;
        this.tooltip.html(text);
        this.tooltip.style('visibility', 'visible');
      }

      const text = `Denomination count for <strong>${d.city}, ${d.state}</strong> in <strong>${d.year}</strong><br/>`
        + `Denomination: ${d.denomination}<br/>`
        + `Number of churches: ${d.churches.toLocaleString()}<br/>`
        + `Total church membership: ${d.members_total.toLocaleString()}`;
      this.tooltip.html(text);
      this.tooltip.style('visibility', 'visible');
    };
  }

  // Draw the unchanging parts of the visualization
  render() {
    // Draw the legend
    const legend = this.viz
      .append('g')
      .attr('fill', '#777')
      .attr('transform', 'translate(120,470)')
      .attr('text-anchor', 'middle')
      .style('font', '10px sans-serif')
      .selectAll('g')
      .join('g')
      .data(this.radius.ticks(4).slice(1))
      .classed('legend', true);

    legend.append('circle')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('cy', (d) => -this.radius(d))
      .attr('r', this.radius)
      .classed('legend', true);

    legend.append('text')
      .attr('y', (d) => -2.1 * this.radius(d))
      .attr('dy', '1.3em')
      .text(this.radius.tickFormat(4, 's'));

    // Draw the map features
    this.viz
      .selectAll('path')
      .data(this.data.northamerica.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('class', 'country');

    this.viz
      .selectAll(null)
      .data(this.data.states.features)
      .enter().append('path')
      .attr('d', this.path)
      .attr('class', 'states');

    // Draw the tooltip
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

    // On first render, draw the default filter selections
    this.update(this.year, this.denominations);
  }

  // Draw the stuff that gets updated
  update(year, denomination) {
    this.year = year;
    this.denomination = denomination;

    // On update, remove existing points and redraw with new data.
    this.viz.selectAll('circle:not(.legend)').remove();

    // Update the denomination data by returning the Promise below
    // array to the updateFilterSelections() function.
    Promise.resolve(this.updateFilterSelections(year, denomination))
      .then((data) => {
        this.viz
          .selectAll('circle:not(.legend)')
          .data(data)
          .join(
            (enter) => enter
              .append('circle')
              .attr('cx', (d) => this.projection([d.lon, d.lat])[0])
              .attr('cy', (d) => this.projection([d.lon, d.lat])[1])
              .attr('r', (d) => this.populationRadiusScale(d.churches))
              .style('stroke-width', '0.5px')
              .attr('class', 'point'),
            (update) => update
              .attr('class', 'point'),
            // (exit) => exit
            //   .remove(),
          );

        this.viz
          .selectAll('circle:not(.legend)')
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
      });
  }

  // When a user selects a year or denomination, we fetch the data from the API and
  // return a Promise that resolves to the data. We then update the visualization
  // with the new data.
  updateFilterSelections(year, denomination) {
    // If a user selects All, we return the cityMembership API to display the data.
    // Otherwise, we return the denominationFilter API url with the selected year and denomination.
    if (this.denomination === 'All') {
      return this.data.cityMembership.filter((d) => d.year === this.year);
    }

    // Set the default values for the year and denomination to 1926 and Protestant Episcopal Church
    // if they are not provided.
    if (year === undefined) {
      year = 1926;
    }
    if (denomination === undefined) {
      denomination = 'Protestant Episcopal Church';
    }

    // Remove all data from the map and redraw with our new data.
    // this.viz.selectAll('circle:not(.legend)').remove();

    const url = `https://data.chnm.org/relcensus/city-membership?year=${year}&denomination=${denomination}`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error('There has been a problem with fetching denominations: ', error);
        console.log('Attempted url: ', url);
      });
  }
}
