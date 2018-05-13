const {Model, Project} = require('../api/models.js');

let fileName = process.argv[1];
console.log(`Opening ${fileName}`);
let project = new Project(0, 'Telecomms Churn', process.argv[2]);
project.init();
console.log(project.view());
console.log(project.getNormalizedData());

let model = new Model(0, project, 'Churn classification model', 'Churn');
console.log(model.view());

