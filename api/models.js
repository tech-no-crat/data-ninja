var mlcart = require('ml-cart');

class Project {
  constructor(name) {
    this.name = name;
  }

  view() {
    return {
      name: this.name
    };
  }
}

class Model {
  constructor(project_id, data, target_index) {
    this.project_id = project_id;
    var trained_model = this.train_model(data, target_index);
    this.classifier = trained_model[0];
    this.error_rate = trained_model[1];
  }2

  train_model(data, target_index) {
    var mlTrainer = require('./ml_training.js');
    var targets = [];

    data.forEach(function(elem) {
      targets.push(elem.splice(target_index));
    })

    return mlTrainer.DecisionTreeTraining(data, targets);
  }

  predict(data, target_index) {
    var mlTrainer = require('./ml_training.js');
    targets = [];

    data.forEach(function(elem) {
      targets.push(elem.splice(target_index));
    });

    return mlTrainer.CalculateErrorRate(targets, this.classifier.predict(data));
  }
}

module.exports = {Project}
module.exports = {Model}