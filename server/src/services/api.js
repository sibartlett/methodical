const MongoClient = require('mongodb').MongoClient;
const mongoService = require('feathers-mongodb');
const withJsonPatch = require('feathers-json-patch');

const createService = withJsonPatch(mongoService);

const newService = ({ db, prefix, ...options }) => {
  let cache = {};
  let getService;

  if (options.Model) {
    cache = createService(options);
    getService = () => cache;
  } else {
    getService = (params) => {
      const { route: { collection } } = params;
      if (!cache[collection]) {
        cache[collection] = createService({
          ...options,
          Model: db.collection(`${prefix || ''}${collection}`)
        });
      }
      return cache[collection];
    };
  }

  return {
    find: (params) => getService(params).find(params),
    get: (id, params) => getService(params).get(id, params),
    create: (data, params) => getService(params).create(data, params),
    remove: (id, params) => getService(params).remove(id, params),
    update: (id, data, params) => getService(params).update(id, data, params),
    patch: (id, data, params) => getService(params).patch(id, data, params),
  };
};

module.exports = app => {

  MongoClient.connect('mongodb://localhost:27017/feathers', { useNewUrlParser: true }).then(client => {

    app.use('/api/schemas', newService({
      Model: client.db('feathers').collection('schemas')
    }));

    app.use('/api/documents/:collection', newService({
      db: client.db('feathers'),
      prefix: 'documents/'
    }));

    app.use('/api/document', {
      patch(id, data, params) {
        return Promise.resolve(data);
      },
      find() {
        return Promise.resolve(schemas);
      },
      get(id) {
        return Promise.resolve(schemas[id]);
      }
    });

  });
};
