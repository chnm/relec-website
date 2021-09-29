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
    const yearSelect = [1906, 1916, 1926, 1936];
    const countType = ['Total churches', 'Total membership', 'Male', 'Female', '< 13', '> 13'];

    // Fetch the list of denominations from the API, and use groupSort to organize them.
    const denominationType = d3.groupSort(this.data.denominations, (d) => d.name, (d) => d.name);

    // We use the spread operator to create an array that includes an
    // "All" option and appends the data from the API.
    const denominationSelection = ['All', ...denominationType];

    d3.select('#year-dropdown')
      .append('label').text('Select a Year')
      .append('select')
      .attr('id', 'year_selection')
      .selectAll('option')
      .data(yearSelect)
      .enter()
      .append('option')
      .attr('value', (d) => d)
      .text((d) => d)
      .property('selected', (d) => d === 1926); // default year -- TODO: should this be an index instead?

    d3.select('#denomination-dropdown')
      .append('label').text('Select a Denomination')
      .append('select')
      .selectAll('option')
      .data(denominationSelection)
      .enter()
      .append('option')
      .attr('value', (d) => d)
      .text((d) => d)
      .property('selected', (d) => d === 'Protestant Episcopal Church'); // default denomination

    d3.select('#count-dropdown')
      .append('label').text('Select a Count')
      .append('select')
      .selectAll('option')
      .data(countType)
      .enter()
      .append('option')
      .attr('value', (d) => d)
      .text((d) => d)
      .property('selected', (d) => d === 'Total churches'); // default count

    // The following handles year data and zoom behavior.
    this.year = d3.select('#year-dropdown').node().value = 1926; // default selected year -- probably a better way to handle this
    this.projection = d3.geoAlbers()
      .translate([this.width / 2 + 60, this.height / 2 + 40])
      .scale(1000);
    this.path = d3.geoPath().projection(this.projection);

    // Provide object key for data joining
    this.key = (d) => d.city + d.state;

    // Keep track of which element is centered
    this.centered = null;

    // Keep track of how much to scale things based on zoom
    this.kScale = 1;

    // Handle point radius scaling
    this.populationRadiusScale = d3.scaleSqrt()
      .domain([0, 100000])
      .range([0, 100]);

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
      this.viz.selectAll('circle')
        .transition()
        .duration(500)
        .attr('r', (d) => this.populationRadiusScale(d.churches))
        .style('stroke-width', `${this.populationRadiusScale(1) / this.kScale}px`);
      this.viz.selectAll('.country')
        .transition()
        .duration(500)
        .style('stroke-width', `${this.populationRadiusScale(1) / k}px`);
      this.viz.selectAll('.states')
        .transition()
        .duration(500)
        .style('stroke-width', `${this.populationRadiusScale(1) / k}px`);
    };

    this.tooltipRender = (e, d) => {
      // We use JS native .toLocalString() to display thousands separator based on user's locale
      const text = `Denomination count for <strong>${d.city}, ${d.state}</strong> in <strong>${d.year}</strong><br/>`
        + `Denominations: ${d.denominations.toLocaleString()}<br/>`
        + `Churches: ${d.churches.toLocaleString()}<br/>`
        + `City population: ${d.population_1926.toLocaleString()}`;
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

    this.viz
      .selectAll(null)
      .data(this.data.states.features)
      .enter().append('path')
      .attr('d', this.path)
      .attr('class', 'states');

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

    this.viz
      .selectAll('circle:not(.legend)')
      .data(this.updateFilterSelections(year, denomination), this.key)
      .join(
        (enter) => enter
          .append('circle')
          .attr('cx', (d) => this.projection([d.lon, d.lat])[0])
          .attr('cy', (d) => this.projection([d.lon, d.lat])[1])
          .attr('r', (d) => this.populationRadiusScale(d.churches))
          .style('stroke-width', this.populationRadiusScale(1))
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

  // When a user selects a year or denomination, we fetch a new URL from the
  // data endpoint to pass along the data selections and assign the resulting
  // array.
  updateFilterSelections(year, denomination) {
    if (this.denomination === 'All') {
      return this.data.cityMembership.filter((d) => d.year === this.year);
    }

    const url = `http://localhost:8090/relcensus/city-membership?year=${year}&denomination=${denomination}`;
    return fetch(url)
      .then(response => response.json())
      .then((data) => data)
      .catch(error => {
        console.error('There has been a problem with fetching denominations:', error);
      });
  }
}
