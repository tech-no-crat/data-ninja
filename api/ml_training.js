const mlcart = require('ml-cart');
const config = require('./config');
const helpers = require('./helpers');


// Randomly partitions the data into a training and test set.
function partitionData(data, target) {
	const randomIndex = 
		Math.ceil(data.length * (Math.random() * (1 - config.testSetPart)));
	let testIndex = Math.ceil(data.length * config.testSetPart);

	// This is a check in the case of an one-off mistake.
	let testEndIndex = Math.min(randomIndex + testIndex, data.length);

	let testSet = data.slice(randomIndex, testEndIndex);
	let trainingSet = data.slice(0, randomIndex).concat(
		data.slice(testEndIndex, data.length));

	let testPredictions = target.slice(randomIndex, testEndIndex).map((x) => x[0]);
	let trainingPredictions = target.slice(0, randomIndex).concat(
		data.slice(testEndIndex, data.length)).map((x) => x[0]);

	return [trainingSet, trainingPredictions, testSet, testPredictions];
}

// Scores the success of the classifier.
function computeF1Score(metrics) {
	let f1Score = 2 * (metrics.precision * metrics.recall) / (metrics.precision + metrics.recall);

	return isNaN(f1Score)? 0 : f1Score;
}

function optimiseParameters(data, target) {
	// TODO: A more sophisticated parameter selection.
	let depths = [5, 10, 15, 20];
	let minNumSamples = [3, 4, 5];

	let f1Score = 0;
	// Best classifier with its metrics.
	var classifier, metrics;

	for (let depth of depths) {
		for (let minSamples of minNumSamples) {

			let [trainingSet, trainingPredictions, testSet, testPredictions] =
			partitionData(data, target);

			let options = {
				gainFunction: 'gini',
				maxDepth: depth,
				minNumSamples: minSamples
			};

			let curClassifier = new mlcart.DecisionTreeClassifier(options);
			curClassifier.train(trainingSet, trainingPredictions);
			
			let result = curClassifier.predict(testSet);
			let curMetrics = calculateMetrics(testPredictions, result);
			let curF1Score = computeF1Score(curMetrics);

			if (curF1Score >= f1Score) {
				f1Score = curF1Score;
				classifier = curClassifier;
				metrics = curMetrics;
			}
		}
	}
	return {classifier, metrics};
}

var trainDecisionTree = (data, target) => {
	// Optimiser returns the best model.
	return optimiseParameters(data, target);
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
