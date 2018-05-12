const parse = require('csv-parse/lib/sync');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const helpers = require('./helpers');

// Class for generating and interacting with feature descriptions.
class FeatureSpec {
  constructor(values) {
    this.values = helpers.clone(values);
    this.type = this.findDominantType();
    if (this.type === 'float') {
      this.values = this.values.map(parseFloat);
      this.generateFloatSpec();
    } else {
      this.generateStringSpec();
    }
  }

  generateFloatSpec() {
    this.missingCount = this.values.filter((x) => isNaN(parseFloat(x))).length
    this.min = this.values.reduce((acc, x) => (x < acc) ? x : acc);
    this.max = this.values.reduce((acc, x) => (x > acc) ? x : acc);
  }

  generateStringSpec() {
    this.missingCount = this.values.filter((x) => x.length === 0).length
    let count = new Map();
    for (let value of this.values) {
      if (value === '') continue;
      if (!count.has(value)) count.set(value, 0);
      count.set(value, count.get(value) + 1);
    }

    this.vocab = new Map();
    Array.from(count).sort((x, y) => x[1] < y[1])
        .map((tuple, index) => [tuple[0], index]).forEach((tuple) => {
      this.vocab.set(tuple[0], tuple[1]);
    });
  }

  // Returns 'float' if enough of the values look like floats
  // or 'string' otherwise.
  findDominantType() {
    // TODO: Think more about what's a float, e.g. edge cases like "23abc"
    // We consider empty strings as floats, since they can be missing data.
    let isFloat = (x) => x === '' || !isNaN(parseFloat(x));
    let floatCount = this.values.filter(isFloat).length;

    if (floatCount/this.values.length >= config.dominantDataTypeThreshold) {
      return 'float';
    }

    return 'string';
  }
}

// Class for generating and interacting with dataset descriptions.
// Can normalize a dataset.
// Essentially a mapping from feature names to FeatureSpecs.
class DataSpec {
  constructor(data = []) {
    this.data = helpers.clone(data);
    if (this.data.length < 2) throw new Error('No data found.');
    this.featureNames = this.data.shift().map((name) => name.trim());

    if (this.featureNames.length < 2) {
      throw new Error('Need at least 2 features, found ' + this.featureNames.length);
    } 

    // Check that all rows have the same number of columns
    if (this.data.filter((row) => row.length == this.featureNames.length).length
        < this.featureNames.length) {
      throw new Error('Some data rows have fewer columns, expected ' + this.featureNames.length
          + ' columns in each row');
    }

    this.featureSpecs = [];
    for (let featureName of this.featureNames) {
      this.featureSpecs[featureName] = new FeatureSpec(this.featureValues(featureName));
    }
  }

  featureValues(featureName) {
    let featureIndex = this.featureNames.indexOf(featureName);
    if (featureIndex < 0) {
      throw new Error(`Feature ${featureName} does not exist in dataset.`);
    }

    return this.data.map((example) => example[featureIndex]);
  }
}

class Project {
  constructor(id, name, filePath) {
    this.id = id;
    this.name = name;
    this.filePath = filePath;
    this.dataSpec = null;
  }

  fullPath() {
    return path.join(config.datasetsPath, this.filePath);
  }

  // Returns a 2D array with the CSV data as strings
  readData() {
    return parse(fs.readFileSync(this.fullPath()));
  }

  // Reads data and generates stats
  init() {
    var data = this.readData();
    this.dataSpec = new DataSpec(data);
  }

  view() {
    return {
      name: this.name,
      features: this.dataSpec.featureNames
    };
  }
}

module.exports = {Project, DataSpec}
