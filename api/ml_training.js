var mlcart = require('ml-cart');

var DecisionTreeTraining = function(data, target) {
	// Defines the size of the test data in respect to the given data.
	test_index = Math.ceil(data.length * 0.3);

	testSet = data.slice(0, test_index);
	trainingSet = data.slice(test_index, data.length);

	testPredictions = target.slice(0, test_index);
	trainingPredictions = target.slice(test_index, target.length);

	// TODO: optimise input parameters.
	// Optimise these parameters.
	var options = {
		gainFunction: 'gini',
		maxDepth: 10,
		minNumSamples: 3
	};

	var classifier = new mlcart.DecisionTreeClassifier(options);

	classifier.train(trainingSet, trainingPredictions);

	var result = classifier.predict(testSet);

	return [classifier, CalculateErrorRate(testPredictions, result)];
};

var CalculateErrorRate = function(classLabels, predictions) {
	var misclassifications = 0;
	for (var i = 0; i < predictions.length; i++) {
		// Misclassification.
		if (predictions[i] != classLabels[i]) {
			misclassifications++;
		} 
	}
	return misclassifications / predictions.length;
}

exports.CalculateErrorRate = CalculateErrorRate;
exports.DecisionTreeTraining = DecisionTreeTraining;