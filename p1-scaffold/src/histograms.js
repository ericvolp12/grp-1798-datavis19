import {scaleLinear, scaleBand} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
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
*   Given a list of songs and a trait, return an Object that contains
*   sorted frequencies of songs whose value for the given trait. Songs are sorted
*   by 0.1 intervals of the value for the given trait.
*   INPUT: data (Object)
*       trait (String)
*   OUTPUT: returns an Object containing the sorted frequencies of the songs
*/
function countTrait(data, trait) {
  const songs = data.songs;
  const counts = {};
  songs.forEach(function sort(d) {
    const val = Math.floor(d[trait] * 10) / 10;
    if (val in counts) {
      counts[val] += 1;
    } else {
      counts[val] = 1;
    }
  });
  // convert counts{} to countArr[]
  const countArr = Object.keys(counts).map(function f(key) {
    return {[key]: counts[key]};
  });
  return countArr;
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
  const counts = countTrait(data, trait);
  const freqs = counts.map(d => Object.values(d)[0]);
  const histSongNames = scaleBand()
    .domain(Array(10).fill().map((a, i) => Math.round((i * 0.1) * 10) / 10))
    .rangeRound([0, height])
    .padding(0.1);
  const histTraitVal = scaleLinear()
    .domain([Math.min(...freqs), Math.max(...freqs)])
    .range([0, width]);

  // draw x-axis (from 0 to trait value)
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(histTraitVal));

  // draw y-axis (bunch of bars representing songs)
  svg.append('g')
    .attr('transform', `translate(${0}, ${0})`)
    .call(axisLeft(histSongNames));

  svg.selectAll('.histBar')
  .data(counts)
  .enter().append('rect')
  .attr('class', 'histBar')
  .attr('width', d => histTraitVal(Object.values(d)[0]))
  .attr('height', histSongNames.bandwidth())
  .attr('y', d => histSongNames(Object.keys(d)[0]));
}

module.exports = {
  drawHistograms
};
