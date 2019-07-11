import io from 'socket.io-client';
import wildcard from 'socketio-wildcard';
import feathers from '@feathersjs/client';

const socket = io();

const patch = wildcard(io.Manager);

patch(socket);

const client = feathers()
  .configure(feathers.socketio(socket));

const applySocketListeners = store =>
  socket.on('*', ({ data: [event, payload] }) => {
    const [service, action] = event.split(' ');
    const [prefix, model] = service.split('/');

    if (prefix !== 'api') {
      return;
    }

    store.dispatch[model][`on__${action}`](payload);
  });

export { applySocketListeners };
export default client;
