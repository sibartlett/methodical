import React, { useEffect } from "react";
import { useActions, useStore } from "easy-peasy";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Field, FieldArray, Form } from "formik";

import Breadcrumbs from "@material-ui/lab/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import { TextField } from "formik-material-ui";

import history from "../../history";
import LoadingState from "../LoadingState";

import SchemaFields from "./SchemaFields";
import { getInitialValues, serialize } from "./schema";
import validationSchema from "./validationSchema";

const mapState = ({
  schemas: {
    item: { current: schema, hasLoaded, isLoading }
  }
}) => ({
  initialValues: getInitialValues(schema),
  schema,
  hasLoaded,
  isLoading
});

const mapActions = ({
  schemas: {
    create: createSchema,
    get: fetchSchema,
    reset: resetSchema,
    save: saveSchema
  }
}) => ({
  fetchSchema,
  createSchema,
  resetSchema,
  saveSchema
});

const SchemaEditor = ({
  match: {
    params: { schemaId }
  },
  ...props
}) => {
  const { initialValues, hasLoaded, isLoading } = useStore(mapState);
  const { fetchSchema, createSchema, resetSchema, saveSchema } = useActions(
    mapActions
  );
  const isNew = schemaId === "new";

  useEffect(() => {
    if (!isNew) {
      fetchSchema({
        id: schemaId
      });
    }

    return resetSchema;
  }, [schemaId]);

  if (!isNew && (isLoading || !hasLoaded)) {
    return <LoadingState />;
  }

  const onSubmit = (values, actions) => {
    const serialized = serialize(values);
    const action = isNew ? createSchema : saveSchema;
    action(serialized).then(item => {
      actions && actions.setSubmitting(false);
      isNew && history.replace(`/schema/${item._id}`);
    });
  };

  return (
    <Formik
      {...props}
      validationSchema={validationSchema}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ dirty, handleReset, handleSubmit }) => (
        <Form>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Breadcrumbs arial-label="Breadcrumb">
                <Link color="inherit" component={RouterLink} to="/schemas">
                  Schemas
                </Link>
                <Typography color="textPrimary">
                  {isNew ? "New" : initialValues.name}
                </Typography>
              </Breadcrumbs>
            </Grid>

            <Grid item xs={12}>
              <Field
                label="Name"
                name="name"
                component={TextField}
                margin="normal"
                fullWidth
                autoFocus={isNew}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Fields
              </Typography>

              <FieldArray name="fields" component={SchemaFields} />
            </Grid>

            <Grid item xs={12}>
              <Grid justify="flex-end" container spacing={24}>
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
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default SchemaEditor;
