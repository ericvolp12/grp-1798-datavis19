import {scaleLinear, scaleBand} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';

function drawHistograms(svg, traits, data, height, width) {
  traits.forEach(trait => {
    const newSvg = svg.append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${0}, ${0})`);
    drawHistogram(newSvg, trait, data, height, width);
  });
}

/*
*   Given a song trait (e.g. liveliness, energy, danceability), draw a histogram
*   structure to relate song trait and playcount (i.e. show what effect a certain
*   song trait has on its popularity)
*   INPUT: trait (String)
*       data (Object)
*   OUTPUT: a drawn histogram on the SVG
*/
function drawHistogram(svg, trait, data, height, width) {
  const histSongNames = scaleBand()
    .domain(data.songs.map(d => d.name))
    .range([0, height])
    .padding(0.1);
  const histTraitVal = scaleLinear()
    .domain([data.domains[trait].min, data.domains[trait].max])
    .range([0, width]);

  svg.selectAll('.histBar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'histBar')
    .attr('width', width)
    .attr('height', height)
    .attr('y', d => histSongNames(d.name));

  // draw x-axis (from 0 to trait value)
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(histTraitVal));

  // draw y-axis (bunch of bars representing songs)
  svg.append('g')
    .attr('transform', `translate(${0}, ${0})`)
    .call(axisLeft(histSongNames));
}

module.exports = {
  drawHistograms
};
