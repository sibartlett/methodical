import { sortBy } from 'lodash-es';

export const getProperties = (schema) => {
  if (!schema || !schema.properties) {
    return [];
  }

  const properties = Object.keys(schema.properties).map(x => [x, schema.properties[x]]);
  return sortBy(properties, ([,property]) => property.ordinal);
};

export const getInitialValues = (schema) => {
  if (!schema) {
    return {
      name: '',
      fields: [{
        name: '',
        type: '',
        label: '',
        deleted: false
      }]
    };
  }

  return {
    name: schema.title || '',
    fields: getProperties(schema).map(([property, options]) => ({
      id: property,
      name: property,
      type: options.type,
      label: options.title,
      deleted: false
    }))
  };
};

export const serialize = ({ name, fields }) => ({
  title: name,
  properties: fields.filter(x => !x.deleted).reduce((props, field, index) => {
    props[field.id || field.name] = {
      ordinal: index,
      type: field.type,
      title: field.label
    }
    return props;
  }, {})
});
