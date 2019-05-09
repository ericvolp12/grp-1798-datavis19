const domReady = require('domready');
import {select} from 'd3-selection';

import {prepareData} from './prepareData';
import {drawHistograms} from './histograms';
import {drawWaterfall} from './waterfall';

const traits = ['danceability', 'energy', 'acousticness', 'liveness', 'valence'];
const metaProps = ['name', 'artists', 'id'];

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

  prepareData('./data/songs.csv', metaProps, traits).then(data => {
<<<<<<< HEAD
    // Remove me before submissions
    console.log(data);

    drawWaterfall(svg, data, height, width, traits);
    drawHistograms(svg, traits, data, height, width);
=======
    drawWaterfall(svg, data, height, width);
    drawHistograms(traits, data, height, width);
>>>>>>> fix histograms
  });
}
