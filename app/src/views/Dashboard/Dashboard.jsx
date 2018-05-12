import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import { withStyles, Grid } from "material-ui";

import {
  ItemGrid
} from "components";
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";

class Dashboard extends React.Component {
  render() {
    const { classes } = this.props;

    const data = [
     {
       name: 'What\'s UP Client Retention',
       models: [
        {
          name: 'Model 1',
          column: 'Dropoff',
        },
        {
          name: 'Model 2',
          column: 'Renew Subscription',
        }
       ]
     },
     {
       name: 'Cosmote 500MB Campaign',
       models: [
        {
          name: 'Model 1',
          column: 'CTR',
        },
        {
          name: 'Model 2',
          column: 'Conversion Rate'
        }
       ]
     }
    ];

    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={12}>
            {data.map(item => (
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>{item.name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Model Name</TableCell>
                        <TableCell>Column</TableCell>
                        <TableCell>Some graph</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {item.models.map((item, index) => (
                        <TableRow key={index} hover className={classes.modelRow}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.column}</TableCell>
                          <TableCell>Graph</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
