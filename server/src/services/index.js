const api = require('./api');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(api);
};
