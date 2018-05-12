const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');

const helpers = require('./helpers');
const models = require('./models');

const datasetsPath = './data/datasets/';

const projects = [];

const app = express();
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/projects', (req, res) => {
  res.send(projects.map((p) => p.view()));
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
  req.files.data.mv(path.join(datasetsPath, fileName)).then(() => {
    projects.push(new models.Project(projects.length, name, fileName));
    let project = projects[projects.length - 1];
    console.log(`Added project ${project.id} with name ${project.name}!`);
    res.send("OK");
  }).catch((e) => helpers.error(res, e, 500));
});

var start = () => {
  app.listen(3000, () => console.log('Listening on port 3000!'));

  helpers.makeDirectory(datasetsPath);

  populateWithDummyData();
}

var populateWithDummyData = () => {
}

start();
