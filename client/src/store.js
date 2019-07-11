import { createStore } from 'easy-peasy';
import { createLogger } from 'redux-logger';
import { applySocketListeners } from './feathers';
import models from './models';

const store = createStore(
  models,
  {
    middleware: [
      createLogger({
        collapsed: true
      })
    ]
  }
);

applySocketListeners(store);

export default store
