import React from "react";
import PropTypes from "prop-types";
import { withStyles, Grid } from "material-ui";
import {
  ItemGrid
} from "components";
import List, { ListItem, ListItemText } from 'material-ui/List';
import Card, { CardContent } from 'material-ui/Card';
import axios from 'axios';
import Typography from 'material-ui/Typography';
import Dropzone from 'react-dropzone'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import {
  RegularCard,
} from "components";

const styles = {
  dropzoneWrapper: {
    marginTop: '20px',
    '& > div': {
      width: '100% !important',
      height: '80px !important',
      margin: 'auto',
      '& > p': {
        textAlign: 'center',
        marginTop: '30px',
        fontWeight: 'bold'
      }
    }
  }
};

class Models extends React.Component {
  state = {
    /*
    data: {
      "id": 0,
      "name": "Churn",
      "metrics": {
        "total": 150,
        "truePositives": 0,
        "falsePositives": 0,
        "trueNegatives": 150, 
        "falseNegatives":0, 
        "recall": 0.4482758620689655,
        "precision": 0.34210526315789475,
        "accuracy": 0.7266666666666667,
      },
      "projectId": 0,
      "target": "Churn",
      "task": "classification"
    },
    */
    data: null,
    results: {
      columns: ['column1', 'column2', 'column3', 'column4'],
      data: [
        {
          'column1': 'column1 data',
          'column2': 352,
          'column3': 32,
          'column4': 'other data',
        },
        {
          'column1': 'column1 data',
          'column2': 352, 'column3': 32,
          'column4': 'other data',
        }
      ]
    }
  };

  async componentDidMount() {
    const modelID = this.props.match.params.id;

    const { data } = await axios.get(`http://localhost:3001/models/${modelID}`);
    this.setState({data});
  }

  onDrop = async files => {
    const modelID = this.props.match.params.id;
    const formdata = new FormData();
    formdata.append('data', files[0]);
    formdata.append('threshold', 53);
    try {
      await axios.post(`/models/${modelID}`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (e) {
      alert(e);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.state.data ? (
        <RegularCard
          headerColor="blue"
          cardTitle={this.state.data.name}
          cardSubtitle="Model details"
          content={
            <div>
              <Grid container>
                <ItemGrid xs={6} sm={6} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText primary="Type" secondary={this.state.data.task} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Date" secondary="12 May 2018" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Target Column" secondary={this.state.data.target} />
                    </ListItem>
                  </List>
                </ItemGrid>
                <ItemGrid xs={6} sm={6} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText primary="Precision" secondary={(this.state.data.metrics.precision * 100).toFixed(2) + '%'} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Recall" secondary={(this.state.data.metrics.recall * 100).toFixed(2) + '%'} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Accuracy" secondary={(this.state.data.metrics.accuracy * 100).toFixed(2) + '%'} />
                    </ListItem>
                  </List>
                </ItemGrid>
              </Grid>
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Advanced Options</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container>
                    <ItemGrid xs={6} sm={6} md={6}>
                      <List>
                        <ListItem>
                          <ListItemText primary="Model Type" secondary="Decision Tree" />
                        </ListItem>
                      </List>
                    </ItemGrid>
                    <ItemGrid xs={6} sm={6} md={6}>
                      <List>
                        <ListItem>
                          <ListItemText primary="Hyperparameters" secondary={(
                          <Typography>
                            <strong>Maximum Depth</strong>: 10<br />
                            <strong>Mininimum number of Samples</strong>: 3<br />
                            <strong>Gain function</strong>: Gini
                          </Typography>
                          )} />
                        </ListItem>
                      </List>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={12}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Column</TableCell>
                            <TableCell>Contribution Level</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow hover className={classes.modelRow}>
                            <TableCell>column1</TableCell>
                            <TableCell>high</TableCell>
                          </TableRow>
                          <TableRow hover className={classes.modelRow}>
                            <TableCell>column2</TableCell>
                            <TableCell>low</TableCell>
                          </TableRow>
                          <TableRow hover className={classes.modelRow}>
                            <TableCell>column1</TableCell>
                            <TableCell>high</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </ItemGrid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          }
        />
        ) : null}
        {this.state.results ? (
        <Card className={classes.card}>
          <CardContent>
            <Typography color="textSecondary" component="h3" variant='headline'>
              Results
            </Typography>

            <Table className={classes.resultsTable}>
              <TableHead>
                <TableRow>
                  {this.state.results.columns.map((column, index) => (
                    <TableCell key={index}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.results.data.map((item, index) => (
                  <TableRow key={index}>
                    {this.state.results.columns.map((column, index) => (
                      <TableCell key={index}>{item[column]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        ) : null}
        <div className={classes.dropzoneWrapper}>
          <Dropzone onDrop={this.onDrop.bind(this)} >
            <p>Drop your CSV file here or click to select the file to upload.</p>
          </Dropzone>
        </div>
      </div>
    );
  }
}

Models.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Models);
