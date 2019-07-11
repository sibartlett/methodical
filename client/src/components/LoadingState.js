import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';

import { makeStyles } from "@material-ui/styles";

const SPINNER_SIZE = 120;

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    height: `calc(100vh - ${theme.spacing.unit * 6}px)`
  },
  spinner: {
    position: "absolute",
    left: `calc(50% - ${SPINNER_SIZE / 2}px)`,
    top: `calc(50% - ${SPINNER_SIZE / 2}px)`
  }
}));

export default () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fade
        in
        style={{
          transitionDelay: '600ms',
        }}
        unmountOnExit
      >
        <CircularProgress className={classes.spinner} size={SPINNER_SIZE} />
      </Fade>
    </div>
  );
};
