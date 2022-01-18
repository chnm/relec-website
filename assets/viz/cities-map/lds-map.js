import * as d3 from 'd3';
import Visualization from '../common/visualization';

export default class LDSMap extends Visualization {
  constructor(id, data, dim) {
    const margin = {
      top: 10, right: 10, bottom: 10, left: 10,
    };
    super(id, data, dim, margin);
    this.colorScale = d3.scaleOrdinal(d3.schemeSet1);
    this.projection = d3.geoAlbers()
      .translate([this.width / 2 + 40, this.height / 2])
      .scale(1000);
    this.path = d3.geoPath().projection(this.projection);

    // Merge our two datasets together for a single dataset. This is necessary
    // for the color scale to work properly.
    this.combinedData = this.data.lds.concat(this.data.rlds);
  }

  render() {
    this.viz
      .selectAll('path')
      .data(this.data.northamerica.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('class', 'country');

    this.viz
      .selectAll('circle:not(.legend)')
      .data(this.combinedData)
      .join('circle')
      .attr('cx', (d) => this.projection([d.lon, d.lat])[0] + 2 - Math.random() * 6)
      .attr('cy', (d) => this.projection([d.lon, d.lat])[1] + 2 - Math.random() * 6)
      .attr('r', 5)
      .style('fill', (d) => this.colorScale(d.group))
      .classed('congregation', true);

    const legend = this.viz
      .append('g')
      .attr('transform', 'translate(0,10)');

    const congregation = this.colorScale.domain();
    for (let i = 0; i < congregation.length; i += 1) {
      legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 25 * i)
        .attr('r', 5)
        .style('fill', this.colorScale(congregation[i]))
        .classed('lds', true)
        .classed('legend', true);
      legend
        .append('text')
        .attr('x', 10)
        .attr('y', 5 + 25 * i)
        .text(`${congregation[i]}`);
    }

    this.tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .attr('id', 'lds-congregation-map-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden');

    this.viz
      .selectAll('circle')
      .on('mouseover', (e, d) => {
        const text = `${d.group}<br/>${d.city}, ${d.state}<br/>Members: ${d.members}<br/>Total churches: ${d.churches}`;
        this.tooltip.html(text);
        this.tooltip.style('visibility', 'visible');
      })
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
      .on('mouseout', () => this.tooltip.style('visibility', 'hidden'));
  }
}
