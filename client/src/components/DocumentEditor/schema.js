import { sortBy } from 'lodash-es';

export const getTitle = (schema, document) => {
  const key = Object.keys(schema.properties)[0];
  return document[key];
}

export const getProperties = (schema) => {
  if (!schema) {
    return [];
  }

  const properties = Object.keys(schema.properties).map(x => [x, schema.properties[x]]);
  return sortBy(properties, ([,property]) => property.ordinal);
};

export const getInitialValues = (schema) => {
  return getProperties(schema).reduce(
    (values, [property, options]) => ({
      ...values,
      [property]: options.type === "boolean" ? false : ""
    }),
    {}
  );
};
