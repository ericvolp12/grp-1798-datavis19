import {csv} from 'd3-fetch';
import {generateScales} from './colors';

// Gets an individual median from the data named by trait
function getMedian(data, trait) {
  data.sort((a, b) => a[trait] - b[trait]);
  return (
    data[(data.length - 1) >> 1][trait] +
    data[data.length >> 1][trait]
  ) / 2;
}

// Gets the medians from all of our songs
function getMedians(data, traits) {
  return traits.reduce((acc, key) => {
    acc[key] = getMedian(data, key);
    return acc;
  }, {});
}

// Gets an individual domain from the data named by trait
function getDomain(data, trait) {
  return data.reduce((acc, row) => {
    const value = row[trait];
    return {
      min: Math.min(value, acc.min),
      max: Math.max(value, acc.max)
    };
  }, {min: Infinity, max: -Infinity});
}

// Gets the domains from all of our songs and traits
function getDomains(data, traits) {
  return traits.reduce((acc, key) => {
    acc[key] = getDomain(data, key);
    return acc;
  }, {});
}

// Converts a medians object into an array of medians to iterate over
function getMediansArray(medians) {
  return Object.keys(medians).map((key) => {
    return {name: key, value: medians[key]};
  });
}

// Builds a clean song object based on traits and metaprops
function buildCleanSong(rawRow, traits, metaProps) {
  const song = traits.reduce((datum, key) => {
    datum[key] = Number(rawRow[key]);
    return datum;
  }, {});
  return metaProps.reduce((datum, prop) => {
    datum[prop] = rawRow[prop];
    return datum;
  }, song);
}

// Converts our traits from strings to numbers
function cleanRawRows(data, traits, metaProps) {
  return data.map((rawRow) => {
    return buildCleanSong(rawRow, traits, metaProps);
  });
}


// Gets the data from CSV and prepares it as JSON
function prepareData(path, metaProps, traits) {
  return openCsv(path).then(rawData => {
    const data = {};
    const s = cleanRawRows(rawData.slice(0), traits, metaProps);
    data.medians = getMedians(s, traits);
    data.mediansArray = getMediansArray(data.medians);
    data.domains = getDomains(s, traits);
    data.scales = generateScales(data);
    data.songs = cleanRawRows(rawData.slice(0), traits, metaProps);
    return data;
  });
}

// Opens the CSV and returns the JSON
function openCsv(path) {
  return csv(path);
}

module.exports = {
  prepareData
};
