import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import { withStyles, Grid } from "material-ui";
import {
  ItemGrid
} from "components";
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Menu, { MenuItem } from 'material-ui/Menu';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import axios from 'axios';
import Dropzone from 'react-dropzone'
import AddIcon from '@material-ui/icons/Add';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

class Dashboard extends React.Component {
  state = {
    projectDialog: {
      open: false
    },
    modelDialog: {
      open: false,
      project_id: null,
    },
    featuresMenu: {
      open: false,
      anchor: null,
      selected: null,
      list: [],
    },
    dataset: null,
    project_name: null,
    model_name: null,
    projects: null,
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  async fetchData() {
    try {
      const { data } = await axios.get('http://localhost:3001/projects');
      if (JSON.stringify(data) !== JSON.stringify(this.state.projects)) {
        this.setState({projects: data});
      }
    } catch (e) {
    }

    setTimeout(() => {
      if (!this.unmount) {
        this.fetchData();
      }
    }, 2000);
  }

  componentDidMount() {
    this.fetchData();
  }

  handleFeaturesOption = value => {
    const state = this.state;
    state.featuresMenu.selected = value;
    state.featuresMenu.open = false;
    this.setState(state);
  }

  handleFeaturesClose = () => {
    const state = this.state;
    state.featuresMenu.open = false;
    this.setState(state);
  }

  openFeaturesMenu = event => {
    const state = this.state;
    state.featuresMenu.anchor = event.target;
    state.featuresMenu.open = true;
    this.setState(state);
  }

  onDrop = files => {
    this.setState({dataset: files[0]});
  }

  handleProjectNameChange = event => {
    this.setState({project_name: event.target.value});
  }

  handleModelNameChange = event => {
    this.setState({model_name: event.target.value});
  }

  handleModelSubmit = async () => {
    if (!this.state.featuresMenu.selected || !this.state.model_name) {
      alert('Please provide model name and target column');
      return;
    }

    const formdata = new FormData();
    formdata.append('name', this.state.model_name);
    formdata.append('target', this.state.featuresMenu.selected);
    try {
      await axios.post(`http://localhost:3001/projects/${this.state.modelDialog.project_id}/models`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      this.handleModelDialogClose();
    } catch (e) {
      alert(e);
    }
  }

  handleProjectSubmit = async () => {
    if (!this.state.dataset || !this.state.project_name) {
      alert('Please provide project name and dataset.');
      return;
    }
  
    const formdata = new FormData();
    formdata.append('data', this.state.dataset);
    formdata.append('name', this.state.project_name);
    try {
      await axios.post(`http://localhost:3001/projects`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      this.handleProjectDialogClose();
    } catch (e) {
      alert(e);
    }
  }

  handleModelClick = modelId => {
    this.props.history.push(`/models/${modelId}`);
  }

  handleProjectDialogClose = () => {
    const state = this.state;
    state.projectDialog.open = false;
    this.setState(state); 
  }

  openProjectDialog = () => {
    const state = this.state;
    state.dataset = null;
    state.project_name = null;
    state.projectDialog.open = true;
    this.setState(state); 
  }

  handleModelDialogClose = () => {
    const state = this.state;
    state.modelDialog.open = false;
    this.setState(state); 
  }

  openModelDialog = (project_id, features) => {
    const state = this.state;
    state.model_name = null;
    state.featuresMenu.selected = null;
    state.modelDialog.open = true;
    state.modelDialog.project_id = project_id;
    state.featuresMenu.list = features;
    this.setState(state); 
  }

  render() {
    const { classes } = this.props;

    const data = this.state.projects || [
     {
       name: 'What\'s UP Client Retention',
       id: 11,
       features: ['foo1', 'bar2', 'a column'],
       models: [
        {
          name: 'Model 1',
          id: 1,
          target: 'Dropoff',
        },
        {
          name: 'Model 2',
          id: 2,
          target: 'Renew Subscription',
        }
       ]
     },
     {
       name: 'Cosmote 500MB Campaign',
       id: 22,
       features: ['foo1', 'bar2', 'a column'],
       models: [
        {
          name: 'Model 1',
          id: 3,
          target: 'CTR',
        },
        {
          name: 'Model 2',
          id: 4,
          target: 'Conversion Rate'
        }
       ]
     }
    ];

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            {data.map((item, index) => (
              <ExpansionPanel key={index}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>{item.name}</Typography>
                  <Typography className={classes.secondaryHeading}>Models: {item.models.length}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Model Name</TableCell>
                        <TableCell>Target Column</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {item.models.map((item, index) => (
                        <TableRow key={index} hover className={classes.modelRow} onClick={this.handleModelClick.bind(this, item.id)}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.target}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                  <Button size="small" color="primary" onClick={this.openModelDialog.bind(this, item.id, item.features)}>
                    Create new model
                  </Button>
                </ExpansionPanelActions>
              </ExpansionPanel>
            ))}
          </ItemGrid>
        </Grid>
        <Button
          variant="fab"
          color="primary"
          aria-label="add"
          className={classes.button}
          onClick={this.openProjectDialog}
        >
          <AddIcon />
        </Button>
        <Dialog onClose={this.handleProjectDialogClose} aria-labelledby="simple-dialog-title" open={this.state.projectDialog.open}>
          <DialogTitle id="simple-dialog-title">Create a new project</DialogTitle>
          <div className={classes.dialogContent}>
            <TextField
              label="Project Name"
              fullWidth
              margin="normal"
              onChange={this.handleProjectNameChange}
            />
            {this.state.dataset ? (
              <p><strong>File:</strong> {this.state.dataset.name}</p>
            ) : null}
            <div className={classes.dropzoneWrapper}>
              <Dropzone onDrop={this.onDrop.bind(this)} >
                <p>Drop your CSV Dataset file here or click to select the file to upload.</p>
              </Dropzone>
            </div>
            <Button variant="raised" color="primary" className={classes.submitButton} onClick={this.handleProjectSubmit}>
              Create Project
            </Button>
          </div>
        </Dialog>

        <Dialog onClose={this.handleModelDialogClose} aria-labelledby="simple-dialog-title" open={this.state.modelDialog.open}>
          <DialogTitle id="simple-dialog-title">Create a new model</DialogTitle>
          <div className={classes.dialogContent}>
            <TextField
              label="Model Name"
              fullWidth
              margin="normal"
              onChange={this.handleModelNameChange}
            />

            <Button fullWidth variant='raised' onClick={this.openFeaturesMenu} className={classes.featuresButton}>
              {this.state.featuresMenu.selected ?
                this.state.featuresMenu.selected :
                'Target Column'}
            </Button>
            <Menu
              open={this.state.featuresMenu.open}
              anchorEl={this.state.featuresMenu.anchor}
              onClose={this.handleFeaturesClose}
            >
              {this.state.featuresMenu.list.map((item, index) => (
                <MenuItem key={index} onClick={this.handleFeaturesOption.bind(this, item)}>{item}</MenuItem>
              ))}
            </Menu>

            <Button variant="raised" color="primary" className={classes.submitButton} onClick={this.handleModelSubmit}>
              Create Model
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
