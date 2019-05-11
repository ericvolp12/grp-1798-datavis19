import {scaleLinear} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {histogram, min, max} from 'd3-array';
import {select} from 'd3-selection';

function drawHistograms(traits, data, height, width, margin) {
  traits.forEach(trait => {
    const histSvg = select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${ margin.left },${ margin.top})`);
    drawHistogram(histSvg, trait, data, height, width);
  });
}

/*
*   Given a song trait (e.g. liveliness, energy, danceability), draw a histogram
*   structure to relate song trait and playcount (i.e. show what effect a certain
*   song trait has on its popularity)
*   INPUT: svg (Object)
*       trait (String)
*       data (Object)
*       height (Number)
*       width (Number)
*   OUTPUT: returns nothing but should draw a histogram on svg
*/
function drawHistogram(svg, trait, data, height, width) {
  // extract each song's trait value from data
  const songs = data.songs;
  const traitValues = songs.map(function getTraitValue(d) {
    return d[trait];
  });
  // create x-y scales & frequency bins
  const histYScale = scaleLinear()
  .domain([min(traitValues), max(traitValues)])
  .range([0, height]);
  const histData = histogram()
  .domain(histYScale.domain())
  .thresholds(histYScale.ticks(5))(traitValues);
  const histXScale = scaleLinear()
  .domain([0, max(histData, function getLength(d) {
    return d.length;
  })])
  .range([0, width]);
  // draw x-axis (from 0 to trait value)
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(histXScale));
  // draw y-axis (bunch of bars representing songs)
  svg.append('g')
    .attr('transform', `translate(${0}, ${0})`)
    .call(axisLeft(histYScale));
  // draw bars
  svg.selectAll('.histBar')
  .data(histData)
  .enter().append('rect')
  .attr('class', 'histBar')
  .attr('width', d => histXScale(d.length))
  .attr('height', d => histYScale(d.x1) - histYScale(d.x0))
  .attr('y', d => histYScale(d.x0));
}

module.exports = {
  drawHistograms
};
