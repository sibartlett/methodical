import React from "react";
import { useStore } from 'easy-peasy';
import { Link } from "react-router-dom";

import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/styles";

import LoadingState from "../LoadingState";

const useStyles = makeStyles(theme => ({
  paper: {
    position: "relative"
  },
  fab: {
    position: "absolute",
    right: "28px",
    top: "-28px"
  }
}));

const mapState = ({
  schemas: {
    items: { hasLoaded, isLoading, items: schemas = [] }
  }
}) => ({
  hasLoaded,
  isLoading,
  schemas
});

const SchemaList = () => {
  const classes = useStyles();
  const { hasLoaded, isLoading, schemas } = useStore(mapState);

  if (isLoading || !hasLoaded) {
    return <LoadingState />;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Schemas
      </Typography>

      <Paper className={classes.paper}>
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.fab}
          component={Link}
          to={`/schema/new`}
        >
          <AddIcon />
        </Fab>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schemas.map(schema => (
              <TableRow key={schema._id}>
                <TableCell component="th" scope="row">
                  <Link to={`/schema/${schema._id}`}>{schema.title}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default SchemaList;
