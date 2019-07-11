import React, { useEffect } from "react";
import { useActions, useStore } from "easy-peasy";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

import Breadcrumbs from "@material-ui/lab/Breadcrumbs";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import history from "../../history";
import LoadingState from "../LoadingState";

import AutoSave from "./AutoSave";
import HistoryButtons from "./HistoryButtons";
import fields from "./fields";
import { getTitle, getProperties, getInitialValues } from "./schema";

const mapState = ({
  documents: {
    item: { current, hasLoaded, isLoading, lastSaved }
  },
  schemas: {
    items: { items: schemas }
  }
}) => ({
  currentDocument: current,
  hasLoaded: hasLoaded,
  isLoading: isLoading,
  lastSaved,
  schemas
});

const mapActions = ({
  documents: {
    create: createDocument,
    get: fetchDocument,
    reset: resetDocument,
    save: saveDocument
  }
}) => ({
  createDocument,
  fetchDocument,
  resetDocument,
  saveDocument
});

const DocumentEditor = (
  {
    match: {
      params: { documentId, schemaId }
    }
  },
  ...props
) => {
  const {
    currentDocument,
    hasLoaded,
    isLoading,
    lastSaved,
    schemas
  } = useStore(mapState);
  const {
    createDocument,
    fetchDocument,
    resetDocument,
    saveDocument
  } = useActions(mapActions);

  const isNew = documentId === "new";
  const schema = schemas.find(x => x._id === schemaId);

  useEffect(() => {
    if (!isNew) {
      fetchDocument({
        id: documentId,
        params: { route: { collection: schemaId } }
      });
    }

    return resetDocument;
  }, [documentId, schemaId]);

  if (!schema || (!isNew && (isLoading || !hasLoaded))) {
    return <LoadingState />;
  }

  const onSubmit = (values, actions) => {
    const action = isNew ? createDocument : saveDocument;
    return action(values).then(item => {
      actions && actions.setSubmitting(false);
      isNew && history.replace(`/documents/${schema._id}/${item._id}`);
    });
  };

  const initialValues = { ...getInitialValues(schema), ...currentDocument };

  return (
    <Formik
      {...props}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ dirty, handleReset, handleSubmit }) => (
        <Form>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Breadcrumbs arial-label="Breadcrumb">
                <Link
                  color="inherit"
                  component={RouterLink}
                  to={`/documents/${schema._id}`}
                >
                  {schema && schema.title}
                </Link>
                <Typography color="textPrimary">
                  {isNew ? "New" : getTitle(schema, initialValues)}
                </Typography>
              </Breadcrumbs>
            </Grid>

            {!isNew && (
              <Grid item xs={12}>
                <Grid justify="flex-end" container spacing={24}>
                  <Grid item>
                    <HistoryButtons />
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
              {getProperties(schema).map(([property, options]) => (
                <div key={property}>
                  <Field name={property} {...fields[options.type](options)} />
                </div>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Grid justify="flex-end" container spacing={24}>
                {isNew && (
                  <>
                    <Grid item>
                      <Button disabled={!dirty} onClick={handleReset}>
                        Reset
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </Grid>
                  </>
                )}
                {!isNew && (
                  <AutoSave
                    debounce={600}
                    save={onSubmit}
                    render={({ isSaving, saveError }) => (
                      <div>
                        {!!isSaving ? (
                          <CircularProgress />
                        ) : !!saveError ? (
                          `Error: ${saveError}`
                        ) : lastSaved ? (
                          `Autosaved ${distanceInWordsToNow(lastSaved)} ago`
                        ) : dirty ? (
                          "Changes not saved"
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default DocumentEditor;
