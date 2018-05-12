import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui";
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
        <RegularCard
          headerColor="blue"
          cardTitle="Model 1"
          cardSubtitle="Model details"
          content={
            <div>
              <List>
                <ListItem>
                  <ListItemText primary="Type" secondary="Classification" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Date" secondary="12 May 2018" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Target Column" secondary="Retention" />
                </ListItem>
              </List>
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Advanced Options</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <List>
                    <ListItem>
                      <ListItemText primary="Model Type" secondary="Decision Tree" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Hyperparameters" secondary="..." />
                    </ListItem>
                  </List>
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
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          }
        />
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
