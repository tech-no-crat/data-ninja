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
import Paper from 'material-ui/Paper';
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
  predictionColumn: {
    background: 'rgba(100, 100, 100, 0.1)',
  },
  tableWrapper: {
    overflow: 'auto',
    marginTop: '20px'
  },
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
    data: null,
    results: null,
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
      const { data } = await axios.post(`http://localhost:3001/models/${modelID}`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      this.setState({results: data});
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
                      <ListItemText primary="Date" secondary="13 May 2018" />
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

            <Paper className={classes.tableWrapper}>
              <Table className={classes.resultsTable}>
                <TableHead>
                  <TableRow>
                    {this.state.results.columns.map((column, index) => (
                      <TableCell
                        className={column === this.state.data.target ? classes.predictionColumn : ''}
                        key={index}
                      >{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.results.data.map((item, index) => (
                    <TableRow key={index}>
                      {this.state.results.columns.map((column, index) => (
                        <TableCell
                          className={column === this.state.data.target ? classes.predictionColumn : ''}
                          key={index}
                        >{item[column]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
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
