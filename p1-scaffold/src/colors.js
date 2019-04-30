import {
  interpolateBlues,
  interpolateReds,
  interpolateGreens,
  interpolatePurples,
  interpolateOranges
} from 'd3-scale-chromatic';

import {scaleSequential} from 'd3-scale';

const colorSchemes = [
  interpolateBlues,
  interpolateReds,
  interpolateGreens,
  interpolatePurples,
  interpolateOranges
];

function generateScales(data) {
  return Object.keys(data.domains).reduce((acc, key, i) => {
    acc[key] = scaleSequential(colorSchemes[i])
      .domain([
        data.domains[key].min,
        data.domains[key].max
      ]);
    return acc;
  }, {});
}

module.exports = {
  colorSchemes,
  generateScales
};
