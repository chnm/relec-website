import * as d3 from 'd3';
import Visualization from '../common/visualization';

export default class DiocesesRiteMap extends Visualization {
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
      .data(this.currentDioceses())
      .join('circle')
      .attr('cx', (d) => this.projection([d.lon, d.lat])[0])
      .attr('cy', (d) => this.projection([d.lon, d.lat])[1])
      .attr('r', 5)
      .style('fill', (d) => this.colorScale(d.rite))
      .classed('nonlatin', true);

    const legend = this.viz
      .append('g')
      .attr('transform', 'translate(0,10)');

    const rites = this.colorScale.domain();
    for (let i = 0; i < rites.length; i += 1) {
      legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 25 * i)
        .attr('r', 5)
        .style('fill', this.colorScale(rites[i]))
        .classed('nonlatin', true)
        .classed('legend', true);
      legend
        .append('text')
        .attr('x', 10)
        .attr('y', 5 + 25 * i)
        .text(`${rites[i]} Rite`);
    }

    this.tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .attr('id', 'dioceses-rite-map-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden');

    this.viz
      .selectAll('circle')
      .on('mouseover', (d) => {
        const text = `Diocese of ${d.city} in ${d.state}<br/>${d.rite} Rite`;
        this.tooltip.html(text);
        this.tooltip.style('visibility', 'visible');
      })
      .on('mousemove', () => this.tooltip.style('top', `${d3.event.pageY - 10}px`).style('left', `${d3.event.pageX + 10}px`))
      .on('mouseout', () => this.tooltip.style('visibility', 'hidden'));
  }

  currentDioceses() {
    return this.data.dioceses.filter((d) => d.rite !== 'Latin');
  }
}
