import {csv} from 'd3-fetch';

const traits = ['danceability', 'energy', 'acousticness', 'liveness', 'valence'];

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

// Converts our traits from strings to numbers
function parseNumsFromData(data) {
  return data.reduce((acc, val) => {
    const song = traits.reduce((datum, key) => {
      datum[key] = Number(val[key]);
      return datum;
    }, {});
    song.name = val.name;
    song.artists = val.artists;
    song.id = val.id;
    acc.songs.push(song);
    return acc;
  }, {songs: []});
}

// Gets the data from CSV and prepares it as JSON
function prepareData(path) {
  return openCsv(path).then(rawData => {
    let data = rawData.slice(0);
    data = parseNumsFromData(data);
    data.medians = getMedians(data.songs);
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
