// if the data you are going to import is small, then you can import it using es6 import
// import MY_DATA from './app/data/example.json'
// (I tend to think it's best to use screaming snake case for imported json)
const domReady = require('domready');
import {prepareData} from './prepare-data';
import {select} from 'd3-selection';
import {scaleBand, scaleLinear} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';

domReady(() => {
  myVis();

});

function myVis() {
  // The posters will all be 24 inches by 36 inches
  // Your graphic can either be portrait or landscape, up to you
  // the important thing is to make sure the aspect ratio is correct.

  // portrait
  const width = 5000;
  const height = 36 / 24 * width;

  // landscape
  // const height = 5000;
  // const width = 36 / 24 * height;
  // console.log('hi!');

  // EXAMPLE FIRST FUNCTION
  prepareData('./data/songs.csv').then(data => {
    console.log('Parsed Data: ', data);
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

