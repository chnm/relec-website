import * as d3 from 'd3';
import Visualization from '../common/visualization';

export default class DenominationsMap extends Visualization {
  constructor(id, data, dim) {
    const margin = {
      top: 10, right: 10, bottom: 10, left: 10,
    };

    super(id, data, dim, margin);

    this.year = d3.select('#year').node().valueAsNumber;
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
        .attr('r', `${3 / this.kScale}px`)
        .style('stroke-width', `${1 / this.kScale}px`);
      this.viz.selectAll('.country')
        .transition()
        .duration(500)
        .style('stroke-width', `${1 / k}px`);
    };

    this.tooltipRender = (e, d) => {
      const countries = {
        BMU: 'Bermuda',
        CAN: 'Canada',
        CUB: 'Cuba',
        DOM: 'Dominican Republic',
        HTI: 'Haiti',
        JAM: 'Jamaica',
        MEX: 'Mexico',
        USA: 'United States',
      };
      const country = countries[d.country];
      const type = dioceseType(d.year_metropolitan, this.year);
      const label = type === 'metropolitan' ? 'Archdiocese' : 'Diocese';
      const text = `${label} of ${d.city}<br/>`
        + `${d.state}, ${country}<br/>`
        + `Founded ${d.year_erected}`;
      this.tooltip.html(text);
      this.tooltip.style('visibility', 'visible');
    };
  }

  // Draw the unchanging parts of the visualization
  render() {
    const yearSelect = [1906, 1926, 1932, 1936];
    const countType = ['Total churches', 'Total membership', 'Male', 'Female', '< 13', '> 13'];
    const denominationType = ['All', 'Anglican', 'Lutheran', '...', '...', '...'];

    d3.select('#year-dropdown')
      .append("label").text("Select a Year")
      .append("select")
      .selectAll("option")
      .data(yearSelect)
      .enter().append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    d3.select('#denomination-dropdown')
      .append("label").text("Select a Denomination")
      .append("select")
      .selectAll("option")
      .data(denominationType)
      .enter().append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    d3.select('#count-dropdown')
      .append("label").text("Select a Count")
      .append("select")
      .selectAll("option")
      .data(countType)
      .enter().append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    // Label for the year
    this.label = this.viz
      .append('text')
      .text(this.year)
      .attr('y', this.height - 25)
      .attr('font-size', 48)
      .attr('alignment-baseline', 'top');

    // Legend for the types of dioceses
    const legend = this.viz
      .append('g')
      .attr('transform', 'translate(120,470)');
    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 5)
      .attr('r', 3 / this.kScale)
      .attr('class', 'diocese')
      .classed('legend', true);
    legend
      .append('text')
      .attr('x', 10)
      .attr('y', 10)
      .attr('font-size', 16)
      .text('Diocese');
    legend
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 25)
      .attr('r', 3 / this.kScale)
      .attr('class', 'metropolitan')
      .classed('legend', true);
    legend
      .append('text')
      .attr('x', 10)
      .attr('y', 30)
      .attr('font-size', 16)
      .text('Archdiocese');

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
    this.label.text(this.year);

    this.viz
      .selectAll('circle:not(.legend)')
      .data(this.currentDioceses(), this.key)
      .join(
        (enter) => enter
          .append('circle')
          .attr('cx', (d) => this.projection([d.lon, d.lat])[0])
          .attr('cy', (d) => this.projection([d.lon, d.lat])[1])
          .attr('r', 3 / this.kScale)
          .style('stroke-width', 1 / this.kScale)
          .attr('class', 'point'),
        (update) => update
          .attr('class', 'point'),
        (exit) => exit
          .remove(),
      );

    this.viz
      .selectAll('circle')
      // .on('mouseover', this.tooltipRender)
      // .on('mousemove', () => {
      //   // Show the tooltip to the right of the mouse, unless we are
      //   // on the rightmost 25% of the browser.
      //   if (event.clientX / this.width >= 0.75) {
      //     this.tooltip
      //       .style('top', `${event.pageY - 10}px`)
      //       .style('left', `${event.pageX - this.tooltip.node().getBoundingClientRect().width - 10}px`);
      //   } else {
      //     this.tooltip
      //       .style('top', `${event.pageY - 10}px`)
      //       .style('left', `${event.pageX + 10}px`);
      //   }
      // })
      // .on('mouseout', () => this.tooltip.style('visibility', 'hidden'))
      .on('click', this.zoom);
  }

  // Filter the data down to the dioceses that should be displayed in a year
  currentDioceses() {
    return this.data.dioceses.filter((d) => d.year_erected <= this.year
      && (d.year_destroyed === null || this.year <= d.year_destroyed)
      && d.rite === 'Latin');
  }
}
