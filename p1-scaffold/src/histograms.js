import {scaleLinear, scaleBand} from 'd3-scale';
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
  const medianSvg = select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${ margin.left },${ margin.top})`);
  drawMedians(medianSvg, data, height, width);
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
    .range([height, 0]);
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
    .attr('height', d => histYScale(d.x0) - histYScale(d.x1))
    .attr('y', d => histYScale(d.x1))
    .attr('fill', d => data.scales[trait](((d.x1 - d.x0) / 2) + d.x0));
}

/*
* Given song data, create a bar chart showing the median value of each
* trait in the data set.
* INPUT:
*   medianSvg (Object)
*   data (Object)
*   height (Number)
*   width (Number)
* OUTPUT:
*   returns nothing, but draws a bar chart
*/
function drawMedians(medianSvg, data, height, width) {
  const medians = data.medians;
  const medianXScale = scaleLinear()
    .domain([min(Object.values(medians)) - 0.05, max(Object.values(medians))])
    .range([0, width]);
  const medianYScale = scaleBand()
    .domain(Object.keys(medians))
    .range([0, height]);
  // draw x-axis
  medianSvg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(medianXScale));
  // draw y-axis
  medianSvg.append('g')
    .attr('transform', `translate(${0}, ${0})`)
    .call(axisLeft(medianYScale));
  // format medians{} as medianArr[] for d3.data
  const medianArr = Object.keys(medians).map(function fieldToObject(d) {
    return {[d]: medians[d]};
  });
  // draw bars
  medianSvg.selectAll('.medianBar')
    .data(medianArr)
    .enter().append('rect')
    .attr('class', 'medianBar')
    .attr('width', d => medianXScale(getValue(d)))
    .attr('height', medianYScale.bandwidth())
    .attr('y', d => medianYScale(getKey(d)))
    .attr('fill', d => data.scales[getKey(d)](data.medians[getKey(d)]));
}

function getKey(d) {
  return Object.keys(d)[0];
}

function getValue(d) {
  return Object.values(d)[0];
}
module.exports = {
  drawHistograms
};
