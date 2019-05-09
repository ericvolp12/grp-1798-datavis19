import {scaleLinear, scaleBand} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';

/*
*   Given a data object, generates a waterfall of the songs inside.
*   INPUT: data (Object)
*     svg (Object)
*     height (Number)
*     width (Number)
*   OUTPUT: Nothing returned but should draw a waterfall on svg
*/
function drawWaterfall(svg, data, height, width) {
  const songs = data.songs;
  const x = scaleLinear()
    .domain([0, 1])
    .range([0, width]);

  const songNames = scaleBand()
    .domain(songs.map(d => d.name))
    .range([0, height])
    .padding(0.1);

  // append the rectangles for the bar chart
  svg.selectAll('.bar')
    .data(songs)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('width', x(1))
    .attr('y', d => songNames(d.name))
    .attr('height', songNames.bandwidth());

  // add the x Axis
  svg.append('g')
    .attr('transform', `translate(0,${ height })`)
    .call(axisBottom(x));

  // add the songNames Axis
  svg.append('g')
    .call(axisLeft(songNames));
}

module.exports = {
  drawWaterfall
};
