const mlcart = require('ml-cart');
const parse = require('csv-parse/lib/sync');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const helpers = require('./helpers');
const mlTrainer = require('./ml_training.js');

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

  view() {
    let ret = {
      type: this.type,
      missingCount: this.missingCount,
    }

    if (this.type === 'string') {
      ret.vocabSize = this.vocabSize;
    } else {
      ret.min = this.min;
      ret.max = this.max;
      ret.median = this.median;
    }

    return ret;
  }

  generateFloatSpec() {
    this.missingCount = this.values.filter((x) => isNaN(parseFloat(x))).length
    this.min = this.values.reduce((acc, x) => (x < acc) ? x : acc);
    this.max = this.values.reduce((acc, x) => (x > acc) ? x : acc);
    let existingValues = this.values.filter((x) => !isNaN(x));
    this.median = existingValues.sort((x, y) => x > y)[Math.floor(existingValues.length / 2)]
  }

  generateStringSpec() {
    this.missingCount = this.values.filter((x) => x.length === 0).length
    let count = new Map();
    for (let value of this.values) {
      if (value === '') continue;
      if (!count.has(value)) count.set(value, 0);
      count.set(value, count.get(value) + 1);
    }
    this.vocabSize = count.size;

    this.vocab = new Map();
    Array.from(count).sort((x, y) => x[1] < y[1])
        .map((tuple, index) => [tuple[0], index]).forEach((tuple) => {
      this.vocab.set(tuple[0], tuple[1]);
    });
  }

  decode(value) {
    console.log(this.type);
    if (this.type === 'double') {
      // TODO
      throw new Error('Can not decode non-string feature values.');
    } else {
      for (let tuple of this.vocab) {
        if (value === tuple[1]) return tuple[0];
      }
      return config.unknownValueToken;
    }
  }

  // Returns 'float' if enough of the values look like floats
  // or 'string' otherwise.
  findDominantType() {
    let hasLetters = (str) => {
      for (let i = 0; i < str.length; i++) {
        if (str[i] >= 'a' && str[i] <= 'z' || str[i] >= 'A' && str[i] <= 'Z') return true;
      }
      return false;
    }
    // TODO: Think more about what's a float, e.g. edge cases like "23abc"
    // We consider empty strings as floats, since they can be missing data.
    let isFloat = (x) =>
      (x === '' || !isNaN(parseFloat(x)) && !hasLetters(x)
    );
    let floatCount = this.values.filter(isFloat).length;

    if (floatCount/this.values.length >= config.dominantDataTypeThreshold) {
      return 'float';
    }

    return 'string';
  }

  normalizeString() {
    return this.values.map((x) => {
      if (!this.vocab.has(x)) {
        return this.vocabSize;
      }
      return this.vocab.get(x);
    });
  }
  
  normalizeFloat() {
    return this.values.map((x) => {
      if (isNaN(x)) x = this.median;
      x = parseFloat(x);
      return (x - this.min) / (this.max - this.min);
    });
  }

  normalize() {
    if (this.type === 'string') return this.normalizeString();
    else if (this.type === 'float') return this.normalizeFloat();
    else throw new Error('Unknown type ' + this.type);
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
        < this.data.length) {
      throw new Error('Some data rows have fewer columns, expected ' + this.featureNames.length
          + ' columns in each row');
    }

    this.featureSpecs = {};
    for (let featureName of this.featureNames) {
      this.featureSpecs[featureName] = new FeatureSpec(this.featureValues(featureName));
    }
  }

  view() {
    let ret = {};
    this.featureNames.forEach((feature) => {
      ret[feature] = this.featureSpecs[feature].view();
    });
    return ret;
  }

  featureValues(featureName) {
    let featureIndex = this.featureNames.indexOf(featureName);
    if (featureIndex < 0) {
      throw new Error(`Feature ${featureName} does not exist in dataset.`);
    }

    return this.data.map((example) => example[featureIndex]);
  }

  normalize(data) {
    return helpers.transpose(helpers.transpose(data).map((featureValues, featureIndex) => {
      return this.featureSpecs[this.featureNames[featureIndex]].normalize(featureValues);
    }));
  }
}

class Project {
  constructor(id, name, filePath) {
    this.id = id;
    this.name = name;
    this.filePath = filePath;
    this.dataSpec = null;
  }

  // Returns a 2D array with the CSV data as strings
  readData() {
    return parse(fs.readFileSync(this.filePath));
  }

  // Reads data and generates stats
  init() {
    var data = this.readData();
    this.dataSpec = new DataSpec(data);
  }

  getRawData() {
    return this.dataSpec.data;
  }

  getNormalizedData() {
    return this.dataSpec.normalize(this.getRawData());
  }

  getFeatureIndex(featureName) {
    return this.dataSpec.featureNames.indexOf(featureName);
  }

  view() {
    return {
      id: this.id,
      name: this.name,
      features: this.dataSpec.featureNames,
      featureSpec: this.dataSpec.view(),
      size: this.dataSpec.data.length
    };
  }
}

class Model {
  constructor(id, project, name, target) {
    this.id = id;
    this.project = project;
    this.target = target;
    this.name = name;
    let {classifier, metrics} = this.trainModel();
    this.classifier = classifier;
    this.metrics = metrics;
  }

  // Modifies data
  separateTargets(data, targetIndex) {
    return data.map((x) => {
      return x.splice(targetIndex, 1);
    });
  }

  trainModel() {
    let data = this.project.getNormalizedData();
    let targetIndex = this.project.getFeatureIndex(this.target);
    helpers.shuffle(data);
    let targets = this.separateTargets(data, targetIndex);
    if (this.targetIndex < 0) {
      throw new Error('Target feature not found.');
    }

    return mlTrainer.trainDecisionTree(data, targets);
  }

  predict(data) {
    let targetIndex = this.project.getFeatureIndex(this.target);
    return this.classifier.predict(data);
  }

  view() {
    return {
      id: this.id,
      name: this.name,
      metrics: this.metrics,
      projectId: this.project.id,
      target: this.target,
      task: 'classification'
    };
  }
}

module.exports = {Project, Model, DataSpec}
