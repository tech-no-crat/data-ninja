const should = require('should');
const models = require('../models');
const helpers = require('../helpers');

const sampleDataset = [
  ['data_consumed', 'minutes_talked', 'messages_sent', 'contract', 'is_happy'],
  ['258.2', '34', '2', 'cosmote 500+', 'false'],
  ['4.12', '43', '32', 'cosmote 500+', 'true'],
  ['23.3', '129', '32', 'cosmote 1000+', 'true'],
  ['0', '129', '32', '', 'true'],
  ['5429.3', '', '32', 'cosmote unlimited', 'true'],
  ['bad data', '', '   4', '2', 'false']
];

describe('DataSpec', () => {
  let DataSpec = models.DataSpec;
  describe('with the sample dataset', () => {
    let dataSpec = null;
    beforeEach(() => {
      dataSpec = new DataSpec(sampleDataset);
    });

    it('should correctly detect feature names', () => {
      should.deepEqual(sampleDataset[0], dataSpec.featureNames);
    });

    it('correctly detects feature types', () => {
      should.equal(dataSpec.featureSpecs['data_consumed'].type, 'float');
      should.equal(dataSpec.featureSpecs['minutes_talked'].type, 'float');
      should.equal(dataSpec.featureSpecs['messages_sent'].type, 'float');
      should.equal(dataSpec.featureSpecs['contract'].type, 'string');
      should.equal(dataSpec.featureSpecs['is_happy'].type, 'string');
    });

    it ('correctly calculates missing count of float features', () => {
      should.equal(dataSpec.featureSpecs['data_consumed'].missingCount, 1);
      should.equal(dataSpec.featureSpecs['minutes_talked'].missingCount, 2);
      should.equal(dataSpec.featureSpecs['messages_sent'].missingCount, 0);
    });

    it ('correctly calculates missing count of string features', () => {
      should.equal(dataSpec.featureSpecs['contract'].missingCount, 1);
      should.equal(dataSpec.featureSpecs['is_happy'].missingCount, 0);
    });

    it ('correctly generates vocabs for user features', () => {
      should.deepEqual(Array.from(dataSpec.featureSpecs['contract'].vocab).sort(), [
        ['cosmote 500+', 0],
        ['cosmote 1000+', 1],
        ['cosmote unlimited', 2],
        ['2', 3],
      ].sort());
    });

    it ('correctly finds statistical characteristics of float features', () => {
      should.equal(dataSpec.featureSpecs['data_consumed'].min, 0);
      should.equal(dataSpec.featureSpecs['data_consumed'].max, 5429.3);
      should.equal(dataSpec.featureSpecs['minutes_talked'].min, 34);
      should.equal(dataSpec.featureSpecs['minutes_talked'].max, 129);
      should.equal(dataSpec.featureSpecs['messages_sent'].min, 2);
      should.equal(dataSpec.featureSpecs['messages_sent'].max, 32);
    });

  });
});

