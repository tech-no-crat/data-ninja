const express = require('express');
const app = express();
const models = require('./models');

var projects = [];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/projects', (req, res) => {
  res.send(projects.map((p) => p.view()));
});

var start = () => {
  app.listen(3000, () => console.log('Listening on port 3000!'));

  projects.push(new models.Project('test project'));
}


start();
