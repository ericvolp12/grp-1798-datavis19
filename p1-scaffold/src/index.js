const domReady = require('domready');
import {prepareData} from './prepare-data';
import {select} from 'd3-selection';
import {scaleLinear, scaleBand} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
// import {max} from 'd3-array';

domReady(() => {
  myVis();
});

function myVis() {
  // portrait view
  const margin = {
    top: 15,
    right: 125,
    bottom: 115,
    left: 360
  };

  // const w = 5000;
  // const h = (36 / 24 * w);

  const w = 1260;
  const h = 2000;

  const width  = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;

  const svg = select('body').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${ margin.left },${ margin.top })`);

  prepareData('./data/songs.csv').then(data => {
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
  });

}
