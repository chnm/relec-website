import * as d3 from 'd3';
import Visualization from '../common/visualization';

// Return the class for the type of diocese
function dioceseType(yearMetropolitan, year) {
  if (yearMetropolitan === null) return 'diocese';
  return yearMetropolitan <= year ? 'metropolitan' : 'diocese';
}

export default class DiocesesMap extends Visualization {
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
  }

  // Draw the unchanging parts of the visualization
  render() {
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
      .attr('r', 3)
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
      .attr('r', 3)
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

    // On first render, draw the stuff that gets updated
    this.update(this.year);
  }

  // Draw the stuff that gets updated
  update(year) {
    this.year = year;
    this.label.text(this.year);

    this.viz
      .selectAll('circle:not(.legend)')
      .data(this.currentDioceses())
      .join(
        (enter) => enter
          .append('circle')
          .attr('cx', (d) => this.projection([d.lon, d.lat])[0])
          .attr('cy', (d) => this.projection([d.lon, d.lat])[1])
          .attr('r', '3px')
          .attr('class', (d) => dioceseType(d.year_metropolitan, year)),
        (update) => update
          .attr('class', (d) => dioceseType(d.year_metropolitan, year)),
        (exit) => exit
          .remove(),
      );

    this.viz
      .selectAll('circle')
      .on('mouseover', (d) => {
        const text = `Diocese of ${d.city} in ${d.state}<br/>`
          + `Founded ${d.year_erected}`;
        this.tooltip.html(text);
        this.tooltip.style('visibility', 'visible');
      })
      .on('mousemove', () => this.tooltip.style('top', `${d3.event.pageY - 10}px`).style('left', `${d3.event.pageX + 10}px`))
      .on('mouseout', () => this.tooltip.style('visibility', 'hidden'));
  }

  // Filter the data down to the dioceses that should be displayed in a year
  currentDioceses() {
    return this.data.dioceses.filter((d) => d.year_erected <= this.year);
  }
}
