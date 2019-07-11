import React, { useEffect } from "react";
import { useActions, useStore } from "easy-peasy";
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
import { getTitle } from "../DocumentEditor/schema";

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

const mapState = (
  {
    documents: {
      items: {
        hasLoaded,
        isLoading,
        items: documents = [],
        params: { route }
      }
    },
    schemas: {
      items: {
        hasLoaded: schemasLoaded,
        isLoading: schemasLoading,
        items: schemas = []
      }
    }
  }
) => ({
  hasLoaded: hasLoaded && schemasLoaded,
  isLoading: isLoading || schemasLoading,
  documents,
  route,
  schemas
});

const mapActions = ({ documents: { find: fetchDocuments, reset } }) => ({
  fetchDocuments,
  resetDocuments: () => reset(true)
});

const DocumentList = ({
  match: {
    params: { schemaId }
  }
}) => {
  const classes = useStyles();
  const { hasLoaded, isLoading, documents, schemas } = useStore(mapState);
  const { fetchDocuments, resetDocuments } = useActions(mapActions);

  const schema = schemas.find(x => x._id === schemaId);

  useEffect(() => {
    fetchDocuments({
      params: { route: { collection: schemaId } }
    });
    return resetDocuments;
  }, [schemaId]);

  if (isLoading || !hasLoaded) {
    return <LoadingState />;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {schema.title}
      </Typography>

      <Paper className={classes.paper}>
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.fab}
          component={Link}
          to={`/documents/${schema._id}/new`}
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
            {documents.map(document => (
              <TableRow key={document._id}>
                <TableCell component="th" scope="row">
                  <Link to={`/documents/${schema._id}/${document._id}`}>
                    {getTitle(schema, document)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default DocumentList;
