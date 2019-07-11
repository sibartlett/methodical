import React, { useState } from "react";
import { FastField, Field } from "formik";
import toidentifier from "toidentifier";

import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Delete from "@material-ui/icons/Delete";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import DragIndicator from "@material-ui/icons/DragIndicator";
import { makeStyles } from "@material-ui/styles";

import { Checkbox, TextField } from "formik-material-ui";

const types = [
  { label: "Text", value: "string" },
  { label: "Boolean", value: "boolean" }
];

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    flexGrow: 1
  },
  grabIcon: {
    color: theme.palette.text.secondary,
    marginLeft: -12,
    marginRight: 12
  },
  deleteIcon: {
    padding: 0
  }
}));

const LabelField = ({ nameField, setFieldValue, isNew, field, ...props }) => {
  if (!isNew) {
    return <TextField {...props} field={field}  />;
  }

  return (
    <TextField {...props} field={{
      ...field,
      onChange: ({ target: { value } }) => {
        setFieldValue(field.name, value);
        setFieldValue(nameField, toidentifier(value));
      }
    }} />
  );
};

const SchemaField = ({
  id,
  deleted,
  label,
  name,
  index2: index,
  setFieldValue
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(!name);

  return (
    <ExpansionPanel
      data-id={index}
      expanded={expanded && !deleted}
      onChange={(e, expand) =>
        e.target.type !== "checkbox" && setExpanded(expand)
      }
    >
      <ExpansionPanelSummary expandIcon={deleted ? null : <ExpandMoreIcon />}>
        <DragIndicator className={classes.grabIcon} />
        <Typography className={classes.heading}>{label}</Typography>
        <Typography className={classes.secondaryHeading}>{name}</Typography>
        <Field
          name={`fields.${index}.deleted`}
          component={Checkbox}
          className={classes.deleteIcon}
          icon={<DeleteOutline />}
          checkedIcon={<Delete />}
        />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <FastField
              label="Label"
              name={`fields.${index}.label`}
              component={LabelField}
              margin="normal"
              fullWidth
              isNew={!id}
              setFieldValue={setFieldValue}
              nameField={`fields.${index}.name`}
            />
          </Grid>
          <Grid item xs={4}>
            <FastField
              label="Name"
              name={`fields.${index}.name`}
              component={TextField}
              margin="normal"
              disabled={!!id}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl margin="normal">
              <InputLabel children="Type" />
              <FastField
                name={`fields.${index}.type`}
                component={TextField}
                margin="normal"
                fullWidth
                disabled={!!id}
                select
              >
                {types.map(x => (
                  <MenuItem key={x.value} value={x.value}>
                    {x.label}
                  </MenuItem>
                ))}
              </FastField>
            </FormControl>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default React.memo(SchemaField);
