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

    // Keep track of which element is centered
    this.centered = null;

    // Keep track of how much to scale things based on zoom
    this.kScale = 0.5;

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
          .attr('r', 5)
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
      .selectAll(null)
      .data(this.data.states.features)
      .enter().append('path')
      .attr('d', this.path)
      .attr('class', 'states');

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
      .attr('transform', 'translate(120,570)');

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
      .on('mouseout', () => this.tooltip.style('visibility', 'hidden'))
      .on('click', this.zoom);
  }
}
