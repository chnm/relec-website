import * as d3 from 'd3';
import Visualization from '../common/visualization';

// To avoid overlapping markers, we want to jitter the points slightly. But the
// jittering shouldn't vary from rendering to rendering, and we don't want to
// import a random number seeding library. So instead, we just provide a limited
// set of random numbers and use them in a closure. The argument pixels
// determines what the maximum amount of jitter will be.
function jitterFactory(pixels) {
  const random = [
    -0.17337332969564012,
    -0.8044061672363676,
    -0.7085270228985721,
    -0.9341195279816954,
    0.11231064594171469,
    0.6152947367401096,
    -0.46236238623993975,
    0.49192797981467384,
    0.7634299593402021,
    0.2645428437586692,
    -0.7092644056711896,
    0.30968152189953435,
    0.9368738160896659,
    0.7236982095941684,
    -0.41247651329490571,
    -0.8393846810568692,
    -0.0030943972050698765,
    0.18827882472033108,
    -0.5121688558962094,
    -0.933589881416313,
    0.3285378576856379,
    0.7895315242728946,
    -0.3472608364753844,
    -0.5372524997547725,
    -0.21772705338562326,
    0.456164241998416,
    0.5730829092855472,
    0.11847978538351267,
    0.4346387539440091,
    -0.15237332918937319,
    0.29026185776954927,
    0.0767452693605235,
    0.7213546495729197,
    -0.7468924528887921,
    0.6519021184491143,
    0.3948439812628137,
    0.43591858058629307,
    0.6634676646705147,
    -0.9222118678655942,
    -0.5041254269951034,
    -0.7308503525647052,
    -0.051415228802816904,
    -0.9532257686633572,
    0.25536397356075535,
    -0.9702294240819413,
    -0.43466058892613635,
    0.9632344611488792,
    -0.38767478964045554,
    0.10127762286307429,
    -0.3823284111905183,
    0.74699439530312,
    0.7982606555498692,
    0.24013069222556682,
    -0.832430125790258,
  ];
  let i = 0;
  return () => {
    const out = random[i] * pixels;
    i += 1;
    return out;
  };
}

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
    this.jitter = jitterFactory(7);
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
      .attr('cx', (d) => this.projection([d.lon, d.lat])[0] + this.jitter())
      .attr('cy', (d) => this.projection([d.lon, d.lat])[1] + this.jitter())
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
      .on('mouseover', (e, d) => {
        let prefix = 'Diocese of ';
        if (d.city.includes('Eparchy')) {
          prefix = '';
        }
        const text = `${prefix}${d.city}<br/>${d.state}<br/>${d.rite} Rite`;
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

  currentDioceses() {
    return this.data.dioceses.filter((d) => d.rite !== 'Latin');
  }
}
