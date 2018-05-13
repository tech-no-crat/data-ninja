const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('./config');
const helpers = require('./helpers');
const {Model, Project} = require('./models');

const projects = [];
const models = [];

const app = express();
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));

const getModelsForProject = (projectId) => {
  return models.filter((model) => model.project.id === projectId);
}

const viewProjectWithModels = (project) => {
  let ret = project.view();
  ret.models = getModelsForProject(project.id).map((m) => m.view());
  return ret;
};

app.get('/projects', (req, res) => {
  res.send(projects.map(viewProjectWithModels));
});

app.get('/projects/:id/models', (req, res) => {
  let projectId = parseInt(req.params.id);
  let project = projects[projectId]; 
  if (!project) return helpers.error(res, `Project ${projectId} not found.`, 404);
  res.send(getModelsForProject(projectId).map((m) => m.view()));
});

app.post('/projects', (req, res) => {
  let name = req.body.name;
  if (typeof name !== 'string' || name.length == 0) {
    return helpers.error(res, 'Parameter name is required, found "' + name + '".', 400);
  }

  if (!req.files || !req.files.data) {
    return helpers.error(res, 'File data is required, but was missing.', 400);
  }

  let fileName = helpers.randomString(5) + '.csv';
  let fullPath = path.join(config.datasetsPath, fileName);
  req.files.data.mv(fullPath).then(() => {
    let project = new Project(projects.length, name, fullPath);
    project.init();
    projects.push(project);

    console.log(`Added project ${project.id} with name ${project.name}!`);
    res.send(viewProjectWithModels(project));
  }).catch((e) => helpers.error(res, e, 500));
});

app.post('/projects/:id/models', (req, res) => {
  let projectId = parseInt(req.params.id);
  let project = projects[projectId];
  let target = req.body.target;
  let name = req.body.name;

  if (!project) return helpers.error(res, `Project ${projectId} not found.`, 404);
  if (!name || name === '') {
    return helpers.error(res, `Name is required but was not specified.`, 400);
  }
  if (!target || target === '') {
    return helpers.error(res, `Target is required but was not specified.`, 400);
  }

  let targetIndex = project.getFeatureIndex(target);
  if (targetIndex < 0) {
    return helpers.error(res, `Feature ${target} does not exist in project.`, 400);
  }

  let model = new Model(models.length, project, name, target);
  models.push(model);

  res.send(model.view());
});

var start = () => {
  app.listen(3001, () => console.log('Listening on port 3001!'));

  helpers.makeDirectory(config.datasetsPath);

  populateWithDummyData();
}

var populateWithDummyData = () => {
  projects.push(new Project(0, 'test model', '31uam.csv'));
  projects[0].init();
}

start();
