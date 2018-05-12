import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import { withStyles, Grid } from "material-ui";
import {
  ItemGrid
} from "components";
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import axios from 'axios';
import Dropzone from 'react-dropzone'
import AddIcon from '@material-ui/icons/Add';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

class Dashboard extends React.Component {
  state = {
    dialog: {
      open: false
    },
    dataset: null,
    project_name: null,
  };

  onDrop = files => {
    this.setState({dataset: files[0]});
  }

  handleNameChange = event => {
    this.setState({project_name: event.target.value});
  }

  handleSubmit = async () => {
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

      this.handleDialogClose();
    } catch (e) {
      alert(e);
    }
  }

  handleModelClick = modelId => {
    this.props.history.push(`/models/${modelId}`);
  }

  handleDialogClose = () => {
    const state = this.state;
    state.dialog.open = false;
    this.setState(state); 
  }

  openDialog = () => {
    const state = this.state;
    state.dataset = null;
    state.project_name = null;
    state.dialog.open = true;
    this.setState(state); 
  }

  render() {
    const { classes } = this.props;

    const data = [
     {
       name: 'What\'s UP Client Retention',
       models: [
        {
          name: 'Model 1',
          id: 1,
          column: 'Dropoff',
        },
        {
          name: 'Model 2',
          id: 2,
          column: 'Renew Subscription',
        }
       ]
     },
     {
       name: 'Cosmote 500MB Campaign',
       models: [
        {
          name: 'Model 1',
          id: 3,
          column: 'CTR',
        },
        {
          name: 'Model 2',
          id: 4,
          column: 'Conversion Rate'
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
                          <TableCell>{item.column}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
          </ItemGrid>
        </Grid>
        <Button
          variant="fab"
          color="primary"
          aria-label="add"
          className={classes.button}
          onClick={this.openDialog}
        >
          <AddIcon />
        </Button>
        <Dialog onClose={this.handleDialogClose} aria-labelledby="simple-dialog-title" open={this.state.dialog.open}>
          <DialogTitle id="simple-dialog-title">Create a new project</DialogTitle>
          <div className={classes.dialogContent}>
            <TextField
              label="Project Name"
              fullWidth
              margin="normal"
              onChange={this.handleNameChange}
            />
            {this.state.dataset ? (
              <p><strong>File:</strong> {this.state.dataset.name}</p>
            ) : null}
            <div className={classes.dropzoneWrapper}>
              <Dropzone onDrop={this.onDrop.bind(this)} >
                <p>Drop your CSV Dataset file here or click to select the file to upload.</p>
              </Dropzone>
            </div>
            <Button variant="raised" color="primary" className={classes.submitButton} onClick={this.handleSubmit}>
              Create Project
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
