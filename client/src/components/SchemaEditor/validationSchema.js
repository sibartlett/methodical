import * as Yup from 'yup';

const FieldSchema = Yup.object().shape({
  deleted: Yup.boolean(),

  name: Yup.string()
    .when('deleted', {
      is: false,
      then: Yup.string().required('Required'),
      otherwise: Yup.string(),
    }),
  label: Yup.string()
    .when('deleted', {
      is: false,
      then: Yup.string().required('Required'),
      otherwise: Yup.string(),
    }),
  type: Yup.string()
    .when('deleted', {
      is: false,
      then: Yup.string().required('Required'),
      otherwise: Yup.string(),
    }),
});

export default Yup.object().shape({
  name: Yup.string()
    .required('Required'),
  fields: Yup.array()
    .of(FieldSchema)
    .required('Required')
    .min(1, 'Too Short!')
    // .test('too-short', 'Too Short!', values => values.some(x => !x.deleted)),
});
