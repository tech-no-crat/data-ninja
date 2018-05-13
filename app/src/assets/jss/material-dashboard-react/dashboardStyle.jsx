// ##############################
// // // Dashboard styles
// #############################

import { successColor } from "assets/jss/material-dashboard-react.jsx";

const dashboardStyle = {
  successText: {
    color: successColor
  },
  upArrowCardCategory: {
    width: 14,
    height: 14
  },
  modelsList: {
    width: '100%',
  },
  modelRow: {
    cursor: 'pointer'
  },
  button: {
    margin: '15px',
  },
  submitButton: {
    margin: '20px auto 0 auto',
    display: 'block',
  },
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  thirdHeading: {
    flexBasis: '33.33%',
    flexShrink: 0,
    color: '#888',
  },
  table: {
    minWidth: '100%'
  },
  featuresButton: {
    background: '#fff',
    marginTop: '20px',
    textTransform: 'none'
  },
  secondaryHeading: {
    flexBasis: '33.33%',
    flexShrink: 0,
    color: '#888',
  },
  dialogContent: {
    padding: '0 20px 20px 20px'
  },
  dropzoneWrapper: {
    '& > div': {
      width: '100% !important',
      height: '80px !important',
      margin: '20px auto 0 auto',
      '& > p': {
        textAlign: 'center',
        marginTop: '18px',
        fontWeight: 'bold',
        padding: '10px',
      }
    }
  },
};

export default dashboardStyle;
