import {csv} from 'd3-fetch';

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
  const medians = {
    danceability: 0,
    energy: 0,
    acousticness: 0,
    liveness: 0,
    speechiness: 0,
    valence: 0,
    tempo: 0
  };
  return Object.keys(medians).reduce((acc, key) => {
    acc[key] = getMedian(data, key);
    return acc;
  }, {});
}

// Converts our traits from strings to numbers
function parseNumsFromData(data) {
  return data.reduce((acc, val) => {
    val.danceability = Number(val.danceability);
    val.energy = Number(val.energy);
    val.acousticness = Number(val.acousticness);
    val.liveness = Number(val.liveness);
    val.speechiness = Number(val.speechiness);
    val.valence = Number(val.valence);
    val.tempo = Number(val.tempo);
    acc.songs.push(val);
    return acc;
  }, {songs: []});
}

// Gets the data from CSV and prepares it as JSON
function prepareData(path) {
  return openCsv(path).then(rawData => {
    let data = rawData.slice(0);
    data = parseNumsFromData(data);
    data.medians = getMedians(data.songs);
    console.log(data);
  });
}

// Opens the CSV and returns the JSON
function openCsv(path) {
  return csv(path);
}

module.exports = {
  prepareData
};
