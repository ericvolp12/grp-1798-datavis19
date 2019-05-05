const domReady = require('domready');
import {prepareData} from './prepare-data';
import {select} from 'd3-selection';
import {scaleLinear, scaleBand} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';


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

  const width = w - margin.left - margin.right;
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

/*
given a song attribute (e.g. liveliness, energy, danceability), draw a histogram
structure to relate song attribute and playcount (i.e. show what effect a certain
song attribute has on its popularity)

INPUT: attribute (String)
       data (Object)
OUTPUT: a drawn histogram on the SVG
*/
function drawHistogram(attribute, data) {
  // NOTE: width, height, and transform arguments need to be changed
  // to appropriate numbers (left as 0 for now because not sure what
  // the layout of the visualization will be) - Alan
  const histHeight = 0;
  const histWidth = 0;
  const maxPlayCount = 0;

  const svg = select('body').append('svg')
  .attr('width', histWidth)
  .attr('height', histHeight)
  .append('g')
  .attr('transform', `translate(${0}, ${0})`);

  const histSongNames = scaleBand()
  .domain(data.songs.map(d => d.name))
  .range([0, histHeight])
  .padding(0.1);
  const histPlayCount = scaleLinear()
  .domain([0, maxPlayCount])
  .range([0, histWidth]);

  // width and height also need to be changed
  svg.selectAll('.histBar')
  .data(data)
  .enter().append('rect')
  .attr('class', 'histBar')
  .attr('width', 0)
  .attr('height', 0)
  .attr('y', d => histSongNames(d.name));

  // draw x-axis (from 0 to playcount)
  svg.append('g')
  .attr('transform', `translate(0, ${histHeight})`)
  .call(axisBottom(histPlayCount));

  // draw y-axis (bunch of bars representing songs)
  svg.append('g')
  .attr('transform', `translate(${0}, ${0})`)
  .call(axisLeft(histSongNames));
}

