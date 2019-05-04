import {csv} from 'd3-fetch';
import {generateScales} from './colors';

const traits = ['danceability', 'energy', 'acousticness', 'liveness', 'valence'];
const metaProps = ['name', 'artists', 'id'];

// Gets an individual median from the data named by trait
function getMedian(data, trait) {
  data.sort((a, b) => a[trait] - b[trait]);
  return (
    data[(data.length - 1) >> 1][trait] +
    data[data.length >> 1][trait]
  ) / 2;
}

// Gets the medians from all of our songs
function getMedians(data) {
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
function getDomains(data) {
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
function buildCleanSong(rawRow) {
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
function cleanRawRows(data) {
  return data.map((rawRow) => {
    return buildCleanSong(rawRow);
  });
}

// Gets the data from CSV and prepares it as JSON
function prepareData(path) {
  return openCsv(path).then(rawData => {
    const data = {};
    data.songs = cleanRawRows(rawData.slice(0));
    data.medians = getMedians(data.songs);
    data.mediansArray = getMediansArray(data.medians);
    data.domains = getDomains(data.songs);
    data.scales = generateScales(data);
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
