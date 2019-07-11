import { useEffect, useState } from "react";
import { debounce, isEqual } from "lodash-es";
import { connect as formConnect } from "formik";

const preSave = debounce(({ initialValues, values }, callback) => {
  if (!isEqual(initialValues, values)) {
    callback();
  }
}, 600);

const AutoSave = ({ formik: { initialValues, values }, render, save }) => {
  const [isSaving, setSaving ] = useState(false);
  const [saveError, setError ] = useState();

  const onSave = () => {
    setSaving(true);

    save(values)
      .then(() => {
        setError();
      })
      .catch(error => {
        setError(error);
      })
      .then(() => {
        setSaving(false);
      });
  };

  useEffect(() => preSave({ initialValues, values}, onSave));

  return render({ isSaving, saveError });
};

export default formConnect(AutoSave);
