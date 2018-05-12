const mlcart = require('ml-cart');
const config = require('./config');
const helpers = require('./helpers');

var trainDecisionTree = (data, target) => {
	test_index = Math.ceil(data.length * config.testSetPart);

	testSet = data.slice(0, test_index);
	trainingSet = data.slice(test_index, data.length);

	testPredictions = target.slice(0, test_index);
	trainingPredictions = target.slice(test_index, target.length);

	// TODO: optimise input parameters.
	var options = {
		gainFunction: 'gini',
		maxDepth: 10,
		minNumSamples: 3
	};

	let classifier = new mlcart.DecisionTreeClassifier(options);
	classifier.train(trainingSet, trainingPredictions);

	let result = classifier.predict(testSet);

	return {classifier, metrics: calculateMetrics(testPredictions, result)};
};

var calculateMetrics = (observations, predictions, positiveClass = 1) => {
  if (observations.length !== predictions.length) {
    throw new Error('Expected observations and predictions to have the same length, but lengths ' +
        'were ' + observations.length + ' and ' + predictions.length + ' correspondingly');
  }

	var metrics = {
    total: predictions.length,
    truePositives: 0,
    falsePositives: 0,
    trueNegatives: 0,
    falseNegatives: 0
  }

  for (let i = 0; i < predictions.length; i++) {
    let observation = observations[i];
    let prediction = predictions[i];
    if (observation === positiveClass && prediction === positiveClass) {
      metrics.truePositives++;
    } else if (observation !== positiveClass && prediction === positiveClass) {
      metrics.falseNegatives++;
    } else if (observation === positiveClass && prediction !== positiveClass) {
      metrics.falsePositives++;
    } else {
      metrics.trueNegatives++;
    }
  }

  metrics.recall = metrics.truePositives / (metrics.truePositives + metrics.falseNegatives);
  metrics.precision = metrics.truePositives / (metrics.truePositives + metrics.falsePositives);
  metrics.accuracy = (metrics.truePositives + metrics.trueNegatives) / metrics.total;
  return metrics;
}

exports.calculateMetrics = calculateMetrics;
exports.trainDecisionTree = trainDecisionTree;
