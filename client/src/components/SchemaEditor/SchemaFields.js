import React from "react";
import Sortable from "react-sortablejs";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";

import SchemaField from "./SchemaField";

const useStyles = makeStyles(() => ({
  ghost: {
    opacity: 0
  }
}));

const SchemaFields = ({
  move,
  push,
  form: {
    setFieldValue,
    values: { fields }
  }
}) => {
  const classes = useStyles();

  const onChange = order => {
    const result = order.reduce(
      (acc, item, index) => {
        const number = parseInt(item, 10);

        if (number === index) {
          return acc;
        }

        if (number > index + 1) {
          if (acc.to === null) {
            acc.from = number;
            acc.to = index;
            return acc;
          }
        }

        if (number > index) {
          if (acc.from === null) {
            acc.from = index;
            return acc;
          }
        }

        if (number < index) {
          if (acc.to === null) {
            acc.to = index;
            return acc;
          }
        }

        return acc;
      },
      {
        from: null,
        to: null
      }
    );

    move(result.from, result.to);
  };

  return (
    <>
      <Sortable
        options={{
          ghostClass: classes.ghost
        }}
        onChange={onChange}
      >
        {fields.map((field, index) => (
          <SchemaField key={field.id || index} index={index} index2={index} setFieldValue={setFieldValue} {...field} />
        ))}
      </Sortable>
      <Button onClick={() => push({ name: "", label: "", type: "" })}>
        Add field
      </Button>
    </>
  );
};

export default SchemaFields;
