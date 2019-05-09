import {scaleLinear, scaleBand} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {select} from 'd3-selection';

function drawHistograms(traits, data, height, width) {
  const margin = {
    top: 15,
    right: 125,
    bottom: 115,
    left: 360
  };
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
  const songs = data.songs;
  const histSongNames = scaleBand()
    .domain(songs.map(d => d.name))
    .range([0, height])
    .padding(0.1);
  const histTraitVal = scaleLinear()
    .domain([data.domains[trait].min, data.domains[trait].max])
    .range([0, width]);

  svg.selectAll('.histBar')
    .data(songs)
    .enter().append('rect')
    .attr('class', 'histBar')
    .attr('width', d => histTraitVal(d[trait]))
    .attr('height', histSongNames.bandwidth())
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
